import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
	BarChart3, 
	Users, 
	CreditCard, 
	Calendar,
	Plus,
	Edit,
	Trash2,
	Brain,
	X,
	TrendingUp,
	AlertTriangle,
	CheckCircle,
	DollarSign
} from 'lucide-react'
import { subscriptionAPI } from '../services/api'
import SubscriptionForm from './SubscriptionForm'
import SubscriptionList from './SubscriptionList'

const Dashboard = () => {
	const [subscriptions, setSubscriptions] = useState([])
	const [upcoming, setUpcoming] = useState([])
	const [showForm, setShowForm] = useState(false)
	const [loading, setLoading] = useState(true)
	const [insights, setInsights] = useState({})
	const [loadingInsights, setLoadingInsights] = useState({})
	const [editingId, setEditingId] = useState(null)
	const [editForm, setEditForm] = useState({})

	useEffect(() => {
		fetchData()
	}, [])

	const fetchData = async () => {
		try {
			const [subsData, upcomingData] = await Promise.all([
				subscriptionAPI.getSubscriptions(),
				subscriptionAPI.getUpcoming(7)
			])
			setSubscriptions(subsData)
			setUpcoming(upcomingData)
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleSuccess = () => {
		setShowForm(false)
		fetchData()
	}

	const startEdit = (subscription) => {
		const sid = subscription._id || subscription.id
		setEditingId(sid)
		setEditForm({
			service_name: subscription.service_name || '',
			cost: Number(subscription.cost ?? 0),
			billing_cycle: subscription.billing_cycle || 'monthly',
			renewal_date: (subscription.renewal_date || '').split('T')[0],
			notes: subscription.notes || '',
			is_shared: !!subscription.is_shared,
			visibility: subscription.visibility || 'private'
		})
	}

	const saveEdit = async (id) => {
		const updateData = {
			service_name: editForm.service_name,
			cost: parseFloat(editForm.cost),
			billing_cycle: editForm.billing_cycle,
			renewal_date: editForm.renewal_date,
			notes: editForm.notes,
			is_shared: editForm.is_shared,
			visibility: editForm.visibility
		}
		try {
			await subscriptionAPI.updateSubscription(id, updateData)
			setEditingId(null)
			fetchData()
		} catch (err) {
			alert('Failed to update subscription')
		}
	}

	const cancelEdit = () => {
		setEditingId(null)
		setEditForm({})
	}

	const fetchInsights = async (subscriptionId) => {
		if (insights[subscriptionId]) return // Already loaded
		
		setLoadingInsights(prev => ({ ...prev, [subscriptionId]: true }))
		try {
			const response = await subscriptionAPI.getInsights(subscriptionId)
			setInsights(prev => ({ ...prev, [subscriptionId]: response.insights }))
		} catch (error) {
			console.error('Error fetching insights:', error)
		} finally {
			setLoadingInsights(prev => ({ ...prev, [subscriptionId]: false }))
		}
	}

	// Calculate metrics from real data
	const totalCost = subscriptions.reduce((sum, sub) => {
		const cost = sub.billing_cycle === 'monthly' ? sub.cost : 
					sub.billing_cycle === 'yearly' ? sub.cost / 12 :
					sub.billing_cycle === 'quarterly' ? sub.cost / 4 : sub.cost * 4
		return sum + cost
	}, 0)

	const sharedCount = subscriptions.filter(sub => sub.visibility === 'shared' || sub.is_shared).length

	const getInsightIcon = (classification) => {
		switch (classification?.toLowerCase()) {
			case 'necessary':
				return <CheckCircle className="w-4 h-4 text-green-600" />
			case 'optional':
				return <AlertTriangle className="w-4 h-4 text-yellow-600" />
			case 'luxury':
				return <DollarSign className="w-4 h-4 text-purple-600" />
			default:
				return <Brain className="w-4 h-4 text-blue-600" />
		}
	}

	const getInsightColor = (classification) => {
		switch (classification?.toLowerCase()) {
			case 'necessary':
				return 'bg-green-50 border-green-200 text-green-800'
			case 'optional':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800'
			case 'luxury':
				return 'bg-purple-50 border-purple-200 text-purple-800'
			default:
				return 'bg-blue-50 border-blue-200 text-blue-800'
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
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
							<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
							<p className="text-sm text-gray-500">Manage your subscriptions with AI insights</p>
						</div>
						<button
							onClick={() => setShowForm(true)}
							className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
						>
							<Plus className="w-5 h-5" />
							<span>Add Subscription</span>
						</button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
								<p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
								<BarChart3 className="w-6 h-6 text-blue-600" />
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
								<p className="text-sm font-medium text-gray-600">Monthly Cost</p>
								<p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
							</div>
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
								<CreditCard className="w-6 h-6 text-green-600" />
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
								<p className="text-sm font-medium text-gray-600">Upcoming Renewals</p>
								<p className="text-2xl font-bold text-gray-900">{upcoming.length}</p>
								<p className="text-sm text-orange-600">Next 7 days</p>
							</div>
							<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
								<Calendar className="w-6 h-6 text-orange-600" />
							</div>
						</div>
					</motion.div>
				</div>

				{/* Subscriptions List with AI Insights */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="bg-white rounded-xl shadow-sm border border-gray-200"
				>
					<div className="p-6 border-b border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900">Your Subscriptions</h3>
					</div>
					<div className="p-6">
						{subscriptions.length === 0 ? (
							<div className="text-center py-8">
								<BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-500">No subscriptions yet</p>
								<button
									onClick={() => setShowForm(true)}
									className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
								>
									Add your first subscription
								</button>
							</div>
						) : (
							<div className="space-y-6">
								{subscriptions.map((sub) => {
									const subscriptionId = sub._id || sub.id
									const subscriptionInsights = insights[subscriptionId]
									const isLoadingInsights = loadingInsights[subscriptionId]
									
									return (
										<div key={subscriptionId} className="border border-gray-200 rounded-lg overflow-hidden">
											{/* Subscription Header */}
											<div className="flex items-center justify-between p-4 bg-gray-50">
												<div className="flex-1">
													<p className="font-medium text-gray-900">{sub.service_name}</p>
													<p className="text-sm text-gray-500">
														${sub.cost} • {sub.billing_cycle} • Renews {new Date(sub.renewal_date).toLocaleDateString()}
													</p>
													{sub.notes && <p className="text-xs text-gray-400 mt-1">{sub.notes}</p>}
												</div>
												<div className="flex items-center space-x-2">
													<span className="font-semibold text-gray-900">${sub.cost}</span>
													<div className="flex space-x-1">
														<button 
															className="p-1 text-gray-400 hover:text-gray-600"
															onClick={() => startEdit(sub)}
														>
															<Edit className="w-4 h-4" />
														</button>
													</div>
												</div>
											</div>

											{/* AI Insights Section */}
											<div className="p-4 border-t border-gray-200">
												<div className="flex items-center justify-between mb-3">
													<div className="flex items-center space-x-2">
														<Brain className="w-5 h-5 text-purple-600" />
														<h4 className="font-medium text-gray-900">AI Insights</h4>
													</div>
													{!subscriptionInsights && !isLoadingInsights && (
														<button
															onClick={() => fetchInsights(subscriptionId)}
															className="text-sm text-purple-600 hover:text-purple-700 font-medium"
														>
															Get Insights
														</button>
													)}
												</div>

												{isLoadingInsights && (
													<div className="flex items-center justify-center py-4">
														<div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
														<span className="ml-2 text-sm text-gray-500">Analyzing subscription...</span>
													</div>
												)}

												{subscriptionInsights && (
													<div className="space-y-4">
														{/* Classification */}
														{subscriptionInsights.classification && (
															<div className="flex items-center space-x-2">
																{getInsightIcon(subscriptionInsights.classification)}
																<span className={`px-2 py-1 rounded-full text-xs font-medium border ${getInsightColor(subscriptionInsights.classification)}`}>
																	{subscriptionInsights.classification}
																</span>
															</div>
														)}

														{/* Cost Analysis */}
														{subscriptionInsights.cost_analysis && (
															<div className="bg-blue-50 p-3 rounded-lg">
																<h5 className="font-medium text-blue-900 mb-2">Cost Analysis</h5>
																<div className="grid grid-cols-2 gap-2 text-sm">
																	<div><span className="text-blue-700">Monthly:</span> ${subscriptionInsights.cost_analysis.monthly_equivalent}</div>
																	<div><span className="text-blue-700">Annual:</span> ${subscriptionInsights.cost_analysis.annual_total}</div>
																	<div><span className="text-blue-700">Daily:</span> ${subscriptionInsights.cost_analysis.cost_per_day}</div>
																	<div><span className="text-blue-700">Value:</span> {subscriptionInsights.cost_analysis.value_assessment}</div>
																</div>
															</div>
														)}

														{/* Recommendations */}
														{subscriptionInsights.recommendations && (
															<div className="bg-green-50 p-3 rounded-lg">
																<h5 className="font-medium text-green-900 mb-2">Recommendations</h5>
																<div className="text-sm text-green-800">
																	<div className="mb-2">
																		<span className="font-medium">Action:</span> {subscriptionInsights.recommendations.action}
																	</div>
																	<div className="mb-2">
																		<span className="font-medium">Reasoning:</span> {subscriptionInsights.recommendations.reasoning}
																	</div>
																	{subscriptionInsights.recommendations.estimated_savings > 0 && (
																		<div className="text-green-700 font-medium">
																			Potential Savings: ${subscriptionInsights.recommendations.estimated_savings}/month
																		</div>
																	)}
																</div>
															</div>
														)}

														{/* Usage Tips */}
														{subscriptionInsights.usage_tips && subscriptionInsights.usage_tips.tips && (
															<div className="bg-yellow-50 p-3 rounded-lg">
																<h5 className="font-medium text-yellow-900 mb-2">Usage Tips</h5>
																<ul className="text-sm text-yellow-800 space-y-1">
																	{subscriptionInsights.usage_tips.tips.map((tip, index) => (
																		<li key={index} className="flex items-start">
																			<span className="text-yellow-600 mr-2">•</span>
																			{tip}
																		</li>
																	))}
																</ul>
															</div>
														)}

														{/* Alternatives */}
														{subscriptionInsights.alternatives && subscriptionInsights.alternatives.length > 0 && (
															<div className="bg-purple-50 p-3 rounded-lg">
																<h5 className="font-medium text-purple-900 mb-2">Alternative Options</h5>
																<div className="space-y-2">
																	{subscriptionInsights.alternatives.slice(0, 3).map((alt, index) => (
																		<div key={index} className="text-sm">
																			<div className="font-medium text-purple-800">
																				{alt.name} - ${alt.cost}/month
																			</div>
																			<div className="text-purple-700">{alt.description}</div>
																			{alt.savings_potential > 0 && (
																				<div className="text-green-700 text-xs">
																					Potential savings: ${alt.savings_potential}/month
																				</div>
																			)}
																		</div>
																	))}
																</div>
															</div>
														)}
													</div>
												)}
											</div>
										</div>
									)
								})}
							</div>
						)}
					</div>
				</motion.div>

				{/* Upcoming Renewals */}
				{upcoming.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6"
					>
						<div className="p-6 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-900">Upcoming Renewals</h3>
							<p className="text-sm text-gray-500">Subscriptions renewing in the next 7 days</p>
						</div>
						<div className="p-6">
							<div className="space-y-4">
								{upcoming.map((sub) => (
									<div key={sub._id || sub.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
										<div>
											<p className="font-medium text-gray-900">{sub.service_name}</p>
											<p className="text-sm text-gray-500">
												Renews on {new Date(sub.renewal_date).toLocaleDateString()}
											</p>
										</div>
										<div className="flex items-center space-x-2">
											<span className="font-semibold text-gray-900">${sub.cost}</span>
											<div className="flex space-x-1">
												<button 
													className="p-1 text-gray-400 hover:text-gray-600"
													onClick={() => startEdit(sub)}
												>
													<Edit className="w-4 h-4" />
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</main>

			{/* Subscription Form Modal */}
			<AnimatePresence>
				{showForm && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="w-full max-w-md"
						>
							<SubscriptionForm onCancel={() => setShowForm(false)} onSuccess={handleSuccess} />
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Edit Subscription Modal */}
			<AnimatePresence>
				{editingId && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
						>
							{/* Header */}
							<div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center text-white">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.2 }}
									className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center"
								>
									<Edit className="w-6 h-6" />
								</motion.div>
								<h1 className="text-2xl font-bold mb-1">Edit Subscription</h1>
								<p className="text-indigo-100 text-sm">Update your subscription details</p>
							</div>

							{/* Form */}
							<div className="p-6">
								<form className="space-y-4">
									{/* Service Name */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Service Name *
										</label>
										<input
											type="text"
											value={editForm.service_name}
											onChange={(e) => setEditForm({ ...editForm, service_name: e.target.value })}
											required
											className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
										/>
									</div>

									{/* Cost and Billing Cycle */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Cost *
											</label>
											<input
												type="number"
												value={editForm.cost}
												onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })}
												step="0.01"
												min="0"
												required
												className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Billing Cycle *
											</label>
											<select
												value={editForm.billing_cycle}
												onChange={(e) => setEditForm({ ...editForm, billing_cycle: e.target.value })}
												required
												className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
											>
												<option value="monthly">Monthly</option>
												<option value="quarterly">Quarterly</option>
												<option value="yearly">Yearly</option>
												<option value="weekly">Weekly</option>
											</select>
										</div>
									</div>

									{/* Renewal Date and Visibility */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Renewal Date *
											</label>
											<input
												type="date"
												value={editForm.renewal_date}
												onChange={(e) => setEditForm({ ...editForm, renewal_date: e.target.value })}
												required
												className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Visibility
											</label>
											<select
												value={editForm.visibility}
												onChange={(e) => setEditForm({ ...editForm, visibility: e.target.value })}
												className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
											>
												<option value="private">Private</option>
												<option value="shared">Shared</option>
											</select>
										</div>
									</div>

									{/* Notes */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Notes
										</label>
										<textarea
											value={editForm.notes}
											onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
											rows="2"
											className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
										/>
									</div>

									{/* Buttons */}
									<div className="flex space-x-3 pt-2">
										<button
											type="button"
											onClick={cancelEdit}
											className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
										>
											Cancel
										</button>
										<button
											type="button"
											onClick={() => saveEdit(editingId)}
											className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
										>
											Save Changes
										</button>
									</div>
								</form>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default Dashboard
