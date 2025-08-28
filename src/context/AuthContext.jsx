import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			authAPI.getCurrentUser()
				.then(userData => {
					setUser(userData)
				})
				.catch(() => {
					localStorage.removeItem('token')
				})
				.finally(() => {
					setLoading(false)
				})
		} else {
			setLoading(false)
		}
	}, [])

	const login = async (email, password) => {
		try {
			const response = await authAPI.login(email, password)
			localStorage.setItem('token', response.access_token)
			const userData = await authAPI.getCurrentUser()
			setUser(userData)
			return userData
		} catch (error) {
			throw error
		}
	}

	const logout = () => {
		localStorage.removeItem('token')
		setUser(null)
	}

	const value = {
		user,
		login,
		logout,
		loading
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)
} 