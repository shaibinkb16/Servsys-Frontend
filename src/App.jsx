import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import Dashboard from './components/Dashboard'
import AdminDashboard from './components/AdminDashboard'
import Navbar from './components/Navbar'
import './App.css'

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="App">
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/forgot-password" element={<ForgotPassword />} />
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<>
										<Navbar />
										<Dashboard />
									</>
								</ProtectedRoute>
							}
						/>
						<Route
							path="/users"
							element={
								<ProtectedRoute adminOnly>
									<>
										<Navbar />
										<AdminDashboard />
									</>
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin"
							element={
								<ProtectedRoute adminOnly>
									<>
										<Navbar />
										<AdminDashboard />
									</>
								</ProtectedRoute>
							}
						/>
					</Routes>
				</div>
			</Router>
		</AuthProvider>
	)
}

export default App
