import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CaseList from './pages/CaseList'
import CaseDetail from './pages/CaseDetail'
import CreateCase from './pages/CreateCase'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<CaseList />} />
        <Route path="/cases/new" element={<CreateCase />} />
        <Route path="/cases/:id" element={<CaseDetail />} />
        <Route path="/clients/new" element={<CreateCase />} />
      </Routes>
    </>
  )
}