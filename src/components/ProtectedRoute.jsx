import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false }) => {
	const { user, loading } = useAuth()
	
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		)
	}
	
	if (!user) return <Navigate to="/login" replace />
	if (adminOnly && !user.is_admin) return <Navigate to="/" replace />
	return children
}

export default ProtectedRoute 