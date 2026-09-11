import client from './client'

export const listCategories = () => client.get('/categories')
export const listLocations = () => client.get('/locations')
export const createLocation = (payload) => client.post('/locations', payload)
