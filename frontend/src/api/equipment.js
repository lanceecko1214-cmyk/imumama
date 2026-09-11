import client from './client'

export const listEquipment = (params) => client.get('/equipment', { params })
export const getEquipment = (id) => client.get(`/equipment/${id}`)
export const createEquipment = (formData) =>
  client.post('/equipment', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateEquipment = (id, formData) =>
  client.post(`/equipment/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const deleteEquipment = (id, notes) => client.delete(`/equipment/${id}`, { data: { notes } })
