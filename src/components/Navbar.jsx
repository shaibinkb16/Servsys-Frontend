import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
	Home, 
	BarChart3, 
	Users, 
	LogOut, 
	Menu,
	X
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	const navigation = [
		{ name: 'Dashboard', href: '/', icon: Home },
		{ name: 'Users', href: '/users', icon: Users, adminOnly: true },
	]

	const isActive = (path) => location.pathname === path

	return (
		<nav className="bg-white shadow-sm border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo and Desktop Navigation */}
					<div className="flex items-center">
						{/* Logo */}
						<Link to="/" className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
								<BarChart3 className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold text-gray-900">SubManager</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:ml-10 md:flex md:space-x-8">
							{navigation.map((item) => {
								if (item.adminOnly && !user?.is_admin) return null
								
								return (
									<Link
										key={item.name}
										to={item.href}
										className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
											isActive(item.href)
												? 'border-purple-500 text-gray-900'
												: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
										}`}
									>
										<item.icon className="w-4 h-4 mr-2" />
										{item.name}
									</Link>
								)
							})}
						</div>
					</div>

					{/* Right side - Logout */}
					<div className="flex items-center space-x-4">
						{/* User Info */}
						<div className="hidden md:block text-right">
							<p className="text-sm font-medium text-gray-900">{user?.email}</p>
							<p className="text-xs text-gray-500">{user?.is_admin ? 'Admin' : 'User'}</p>
						</div>

						{/* Logout Button */}
						<button
							onClick={handleLogout}
							className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
						>
							<LogOut className="w-4 h-4" />
							<span className="hidden md:block text-sm font-medium">Sign out</span>
						</button>

						{/* Mobile menu button */}
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden p-2 text-gray-400 hover:text-gray-500 transition-colors"
						>
							{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden border-t border-gray-200"
					>
						<div className="px-2 pt-2 pb-3 space-y-1">
							{/* Mobile Navigation */}
							{navigation.map((item) => {
								if (item.adminOnly && !user?.is_admin) return null
								
								return (
									<Link
										key={item.name}
										to={item.href}
										onClick={() => setIsMobileMenuOpen(false)}
										className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
											isActive(item.href)
												? 'bg-purple-100 text-purple-700'
												: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
										}`}
									>
										<item.icon className="w-5 h-5 mr-3" />
										{item.name}
									</Link>
								)
							})}

							{/* Mobile User Info and Logout */}
							<div className="border-t border-gray-200 pt-4 mt-4">
								<div className="flex items-center px-3 py-2">
									<div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
										<BarChart3 className="w-4 h-4 text-white" />
									</div>
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-900">{user?.email}</p>
										<p className="text-xs text-gray-500">{user?.is_admin ? 'Admin' : 'User'}</p>
									</div>
								</div>
								<button
									onClick={() => {
										handleLogout()
										setIsMobileMenuOpen(false)
									}}
									className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
								>
									<LogOut className="w-5 h-5 mr-3" />
									Sign out
								</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	)
}

export default Navbar 