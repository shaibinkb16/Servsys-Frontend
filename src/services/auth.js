import api from './api'

export const authAPI = {
	async login(email, password) {
		const formData = new FormData()
		formData.append('username', email)
		formData.append('password', password)

		const response = await api.post('/token', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})

		return response.data
	},

	async getCurrentUser() {
		const response = await api.get('/users/me')
		return response.data
	},

	async verifyToken(token) {
		const response = await api.get('/users/me', {
			headers: { 'Authorization': `Bearer ${token}` }
		})
		return response.data
	}
} 