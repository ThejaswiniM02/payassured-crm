from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date
from decimal import Decimal
import models
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="PayAssured CRM")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Pydantic Schemas ──────────────────────────────────────────────

class ClientCreate(BaseModel):
    client_name: str
    company_name: str
    city: str
    contact_person: str
    phone: str
    email: EmailStr

class ClientOut(ClientCreate):
    id: int
    class Config:
        from_attributes = True

class CaseCreate(BaseModel):
    client_id: int
    invoice_number: str
    invoice_amount: Decimal
    invoice_date: date
    due_date: date
    status: str = "New"
    last_follow_up_notes: Optional[str] = None

class CasePatch(BaseModel):
    status: Optional[str] = None
    last_follow_up_notes: Optional[str] = None

class CaseOut(BaseModel):
    id: int
    client_id: int
    invoice_number: str
    invoice_amount: Decimal
    invoice_date: date
    due_date: date
    status: str
    last_follow_up_notes: Optional[str]
    client: ClientOut

    class Config:
        from_attributes = True

# ── Client Endpoints ─────────────────────────────────────────────

@app.post("/clients", response_model=ClientOut, status_code=201)
def create_client(payload: ClientCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Client).filter(models.Client.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    client = models.Client(**payload.dict())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

@app.get("/clients", response_model=List[ClientOut])
def list_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()

# ── Case Endpoints ───────────────────────────────────────────────

VALID_STATUSES = {"New", "In Follow-up", "Partially Paid", "Closed"}

@app.post("/cases", response_model=CaseOut, status_code=201)
def create_case(payload: CaseCreate, db: Session = Depends(get_db)):
    client = db.query(models.Client).filter(models.Client.id == payload.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    if payload.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {VALID_STATUSES}")
    case = models.Case(**payload.dict())
    db.add(case)
    db.commit()
    db.refresh(case)
    return case

@app.get("/cases", response_model=List[CaseOut])
def list_cases(
    status: Optional[str] = Query(None),
    sort: Optional[str] = Query("asc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    q = db.query(models.Case).join(models.Client)
    if status:
        q = q.filter(models.Case.status == status)
    order = asc(models.Case.due_date) if sort == "asc" else desc(models.Case.due_date)
    return q.order_by(order).all()

@app.get("/cases/{case_id}", response_model=CaseOut)
def get_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@app.patch("/cases/{case_id}", response_model=CaseOut)
def update_case(case_id: int, payload: CasePatch, db: Session = Depends(get_db)):
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if payload.status and payload.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status")
    if payload.status is not None:
        case.status = payload.status
    if payload.last_follow_up_notes is not None:
        case.last_follow_up_notes = payload.last_follow_up_notes
    db.commit()
    db.refresh(case)
    return case