import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
	Users, 
	BarChart3, 
	Plus, 
	X, 
	Edit, 
	Trash2, 
	Eye,
	UserPlus,
	Shield,
	Mail,
	Calendar,
	DollarSign,
	TrendingUp,
	CheckCircle,
	AlertTriangle
} from 'lucide-react'
import { subscriptionAPI, userAPI } from '../services/api'

const AdminDashboard = () => {
	const [subscriptions, setSubscriptions] = useState([])
	const [users, setUsers] = useState([])
	const [showUserForm, setShowUserForm] = useState(false)
	const [userForm, setUserForm] = useState({ email: '', password: '', is_admin: false })
	const [loading, setLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('overview')
	const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)

	useEffect(() => {
		fetchAll()
	}, [])

	const fetchAll = async () => {
		try {
			const [subs, us] = await Promise.all([
				subscriptionAPI.getSubscriptions(),
				userAPI.getUsers(),
			])
			setSubscriptions(subs)
			setUsers(us)
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleCreateUser = async (e) => {
		e.preventDefault()
		try {
			await userAPI.createUser(userForm)
			setIsAddUserModalOpen(false)
			setUserForm({ email: '', password: '', is_admin: false })
			fetchAll()
		} catch (error) {
			console.error('Error creating user:', error)
		}
	}

	const handleDeleteUser = async (userId) => {
		if (!window.confirm("Are you sure you want to delete this user?")) return;
		try {
			await userAPI.deleteUser(userId);
			fetchAll();
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	};

	const handleDeleteSubscription = async (subscriptionId) => {
		if (!window.confirm("Are you sure you want to delete this subscription?")) return;
		try {
			await subscriptionAPI.deleteSubscription(subscriptionId);
			fetchAll();
		} catch (error) {
			console.error("Error deleting subscription:", error);
		}
	};

	// Calculate metrics
	const totalUsers = users.length
	const totalSubscriptions = subscriptions.length
	const totalCost = subscriptions.reduce((sum, sub) => {
		const cost = sub.billing_cycle === 'monthly' ? sub.cost : 
					sub.billing_cycle === 'yearly' ? sub.cost / 12 :
					sub.billing_cycle === 'quarterly' ? sub.cost / 4 : sub.cost * 4
		return sum + cost
	}, 0)
	const adminUsers = users.filter(user => user.is_admin).length

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
				/>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
							<p className="text-sm text-gray-500">Manage users and monitor subscriptions</p>
						</div>
						<button
							onClick={() => setIsAddUserModalOpen(true)}
							className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
						>
							<UserPlus className="w-5 h-5" />
							<span>Add User</span>
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Total Users</p>
								<p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
								<Users className="w-6 h-6 text-blue-600" />
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
								<p className="text-2xl font-bold text-gray-900">{totalSubscriptions}</p>
							</div>
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
								<BarChart3 className="w-6 h-6 text-green-600" />
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
								<p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
							</div>
							<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
								<DollarSign className="w-6 h-6 text-purple-600" />
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Admin Users</p>
								<p className="text-2xl font-bold text-gray-900">{adminUsers}</p>
							</div>
							<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
								<Shield className="w-6 h-6 text-orange-600" />
							</div>
						</div>
					</motion.div>
				</div>

				{/* Tabs */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
					<div className="border-b border-gray-200">
						<nav className="flex space-x-8 px-6">
							<button
								onClick={() => setActiveTab('overview')}
								className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
									activeTab === 'overview'
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								Overview
							</button>
							<button
								onClick={() => setActiveTab('users')}
								className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
									activeTab === 'users'
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								Users
							</button>
							<button
								onClick={() => setActiveTab('subscriptions')}
								className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
									activeTab === 'subscriptions'
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								Subscriptions
							</button>
						</nav>
					</div>

					<div className="p-6">
						<AnimatePresence mode="wait">
							{/* Overview Tab */}
							{activeTab === 'overview' && (
								<motion.div
									key="overview"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									className="space-y-6"
								>
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
										{/* Recent Users */}
										<div className="bg-gray-50 rounded-lg p-6">
											<h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
											<div className="space-y-3">
												{users.slice(0, 5).map((user) => (
													<div key={user._id || user.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
														<div className="flex items-center space-x-3">
															<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
																<Users className="w-4 h-4 text-blue-600" />
															</div>
															<div>
																<p className="font-medium text-gray-900">{user.email}</p>
																<p className="text-sm text-gray-500">{user.is_admin ? 'Admin' : 'User'}</p>
															</div>
														</div>
														{user.is_admin && (
															<Shield className="w-4 h-4 text-orange-500" />
														)}
													</div>
												))}
											</div>
										</div>

										{/* Recent Subscriptions */}
										<div className="bg-gray-50 rounded-lg p-6">
											<h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Subscriptions</h3>
											<div className="space-y-3">
												{subscriptions.slice(0, 5).map((sub) => (
													<div key={sub._id || sub.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
														<div className="flex items-center space-x-3">
															<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
																<BarChart3 className="w-4 h-4 text-green-600" />
															</div>
															<div>
																<p className="font-medium text-gray-900">{sub.service_name}</p>
																<p className="text-sm text-gray-500">${sub.cost} • {sub.billing_cycle}</p>
															</div>
														</div>
														<span className="text-sm font-medium text-gray-900">${sub.cost}</span>
													</div>
												))}
											</div>
										</div>
									</div>
								</motion.div>
							)}

							{/* Users Tab */}
							{activeTab === 'users' && (
								<motion.div
									key="users"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									className="space-y-6"
								>
									{/* User Form */}
									<AnimatePresence>
										{showUserForm && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: 'auto' }}
												exit={{ opacity: 0, height: 0 }}
												className="bg-blue-50 border border-blue-200 rounded-lg p-6"
											>
												<div className="flex items-center justify-between mb-4">
													<h3 className="text-lg font-semibold text-blue-900">Add New User</h3>
													<button
														onClick={() => setShowUserForm(false)}
														className="text-blue-600 hover:text-blue-700"
													>
														<X className="w-5 h-5" />
													</button>
												</div>
												<form onSubmit={handleCreateUser} className="space-y-4">
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
															<input
																type="email"
																value={userForm.email}
																onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
																required
																className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
															/>
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
															<input
																type="password"
																value={userForm.password}
																onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
																required
																className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
															/>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<input
															type="checkbox"
															checked={userForm.is_admin}
															onChange={(e) => setUserForm({ ...userForm, is_admin: e.target.checked })}
															className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
														/>
														<label className="text-sm text-gray-700">Admin privileges</label>
													</div>
													<div className="flex space-x-3">
														<button
															type="submit"
															className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
														>
															Create User
														</button>
														<button
															type="button"
															onClick={() => setShowUserForm(false)}
															className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
														>
															Cancel
														</button>
													</div>
												</form>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Users List */}
									<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
										<div className="px-6 py-4 border-b border-gray-200">
											<h3 className="text-lg font-semibold text-gray-900">All Users</h3>
										</div>
										<div className="divide-y divide-gray-200">
											{users.map((user) => (
												<div key={user._id || user.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-4">
															<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
																<Users className="w-5 h-5 text-blue-600" />
															</div>
															<div>
																<p className="font-medium text-gray-900">{user.email}</p>
																<p className="text-sm text-gray-500">User ID: {user._id || user.id}</p>
															</div>
														</div>
														<div className="flex items-center space-x-3">
															{user.is_admin && (
																<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
																	<Shield className="w-3 h-3 mr-1" />
																	Admin
																</span>
															)}
															<div className="flex space-x-2">
																
																<button
																	onClick={() => handleDeleteUser(user._id || user.id)}
																	className="p-1 text-red-400 hover:text-red-600"
																>
																	<Trash2 className="w-4 h-4" />
																</button>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</motion.div>
							)}

							{/* Subscriptions Tab */}
							{activeTab === 'subscriptions' && (
								<motion.div
									key="subscriptions"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									className="space-y-6"
								>
									<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
										<div className="px-6 py-4 border-b border-gray-200">
											<h3 className="text-lg font-semibold text-gray-900">All Subscriptions</h3>
										</div>
										<div className="divide-y divide-gray-200">
											{subscriptions.map((sub) => (
												<div key={sub._id || sub.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-4">
															<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
																<BarChart3 className="w-5 h-5 text-green-600" />
															</div>
															<div>
																<p className="font-medium text-gray-900">{sub.service_name}</p>
																<p className="text-sm text-gray-500">
																	${sub.cost} • {sub.billing_cycle} • Renews {new Date(sub.renewal_date).toLocaleDateString()}
																</p>
																{sub.notes && <p className="text-xs text-gray-400 mt-1">{sub.notes}</p>}
															</div>
														</div>
														<div className="flex items-center space-x-3">
															<span className="font-semibold text-gray-900">${sub.cost}</span>
															<div className="flex space-x-2">
																{/* <button className="p-1 text-gray-400 hover:text-gray-600">
																	<Eye className="w-4 h-4" />
																</button>
																<button className="p-1 text-gray-400 hover:text-gray-600">
																	<Edit className="w-4 h-4" />
																</button> */}
																<button
																	onClick={() => handleDeleteSubscription(sub._id || sub.id)}
																	className="p-1 text-red-400 hover:text-red-600"
																>
																	<Trash2 className="w-4 h-4" />
																</button>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>

				{/* Add User Modal */}
				<AnimatePresence>
					{isAddUserModalOpen && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
						>
							<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
								<div className="flex justify-between items-center mb-4">
									<h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
									<button onClick={() => setIsAddUserModalOpen(false)} className="text-gray-500 hover:text-gray-700">
										<X className="w-5 h-5" />
									</button>
								</div>
								<form onSubmit={handleCreateUser} className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
										<input
											type="email"
											value={userForm.email}
											onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
											required
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
										<input
											type="password"
											value={userForm.password}
											onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
											required
											className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											checked={userForm.is_admin}
											onChange={(e) => setUserForm({ ...userForm, is_admin: e.target.checked })}
											className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
										/>
										<label className="text-sm text-gray-700">Admin privileges</label>
									</div>
									<div className="flex space-x-3">
										<button
											type="submit"
											className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
										>
											Create User
										</button>
										<button
											type="button"
											onClick={() => setIsAddUserModalOpen(false)}
											className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
										>
											Cancel
										</button>
									</div>
								</form>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</main>
		</div>
	)
}

export default AdminDashboard