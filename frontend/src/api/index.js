import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getClients = () => api.get('/clients').then(r => r.data)
export const createClient = (data) => api.post('/clients', data).then(r => r.data)

export const getCases = (params) => api.get('/cases', { params }).then(r => r.data)
export const getCase = (id) => api.get(`/cases/${id}`).then(r => r.data)
export const createCase = (data) => api.post('/cases', data).then(r => r.data)
export const patchCase = (id, data) => api.patch(`/cases/${id}`, data).then(r => r.data)