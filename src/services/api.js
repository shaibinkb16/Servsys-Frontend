import axios from 'axios'

const API_BASE_URL = 'https://servsys-backend.onrender.com'
const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token')
			if (window.location.pathname !== '/login') {
				window.location.href = '/login'
			}
		}
		return Promise.reject(error)
	}
)

export const subscriptionAPI = {
	getSubscriptions: () => api.get('/subscriptions/').then((r) => r.data),
	getUpcoming: (withinDays = 7) => api.get(`/subscriptions/upcoming`, { params: { within_days: withinDays } }).then((r) => r.data),
	createSubscription: (data) => api.post('/subscriptions/', data).then((r) => r.data),
	updateSubscription: (id, data) => api.put(`/subscriptions/${id}`, data).then((r) => r.data),
	deleteSubscription: (id) => api.delete(`/subscriptions/${id}`).then((r) => r.data),
	getInsights: (id) => api.get(`/subscriptions/${id}/insights`).then((r) => r.data),
}

export const userAPI = {
	getUsers: () => api.get('/users/').then((r) => r.data),
	createUser: (data) => api.post('/users/', data).then((r) => r.data),
	updateNotificationPreferences: (preferences) => api.put('/users/me/notifications', preferences).then((r) => r.data),
	deleteUser: (id) => api.delete(`/users/${id}`).then((r) => r.data),
}

export const notificationAPI = {
	getNotifications: (limit = 50) => api.get('/notifications/', { params: { limit } }).then((r) => r.data),
	getUnreadCount: () => api.get('/notifications/unread-count').then((r) => r.data),
	markAsRead: (id) => api.put(`/notifications/${id}/read`).then((r) => r.data),
	checkRenewals: () => api.post('/notifications/check-renewals').then((r) => r.data),
}

export default api