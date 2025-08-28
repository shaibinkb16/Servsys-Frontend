import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
	Plus, 
	X, 
	Calendar,
	DollarSign,
	FileText,
	Eye,
	EyeOff
} from 'lucide-react'
import { subscriptionAPI } from '../services/api'

const SubscriptionForm = ({ onCancel, onSuccess }) => {
	const [formData, setFormData] = useState({
		service_name: '',
		cost: '',
		billing_cycle: 'monthly',
		renewal_date: '',
		notes: '',
		visibility: 'private'
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			await subscriptionAPI.createSubscription({
				...formData,
				cost: parseFloat(formData.cost),
				is_shared: formData.visibility === 'shared'
			})
			onSuccess()
		} catch (err) {
			setError('Failed to create subscription. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			{/* Main Container */}
			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center text-white">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2 }}
						className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center"
					>
						<Plus className="w-6 h-6" />
					</motion.div>
					<h1 className="text-2xl font-bold mb-1">Add Subscription</h1>
					<p className="text-blue-100 text-sm">Track your new subscription service</p>
				</div>

				{/* Form */}
				<div className="p-6">
					{/* Error Message */}
					{error && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
						>
							<p className="text-red-600 text-sm">{error}</p>
						</motion.div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Service Name */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Service Name *
							</label>
							<div className="relative">
								<FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
								<input
									type="text"
									name="service_name"
									value={formData.service_name}
									onChange={handleChange}
									placeholder="e.g., Netflix, Spotify, Adobe Creative Cloud"
									required
									className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
								/>
							</div>
						</div>

						{/* Cost and Billing Cycle */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Cost *
								</label>
								<div className="relative">
									<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
									<input
										type="number"
										name="cost"
										value={formData.cost}
										onChange={handleChange}
										placeholder="0.00"
										step="0.01"
										min="0"
										required
										className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Billing Cycle *
								</label>
								<select
									name="billing_cycle"
									value={formData.billing_cycle}
									onChange={handleChange}
									required
									className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
								<div className="relative">
									<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
									<input
										type="date"
										name="renewal_date"
										value={formData.renewal_date}
										onChange={handleChange}
										required
										className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Visibility
								</label>
								<select
									name="visibility"
									value={formData.visibility}
									onChange={handleChange}
									className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
								name="notes"
								value={formData.notes}
								onChange={handleChange}
								placeholder="Add any additional notes about this subscription..."
								rows="2"
								className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
							/>
						</div>

						{/* Buttons */}
						<div className="flex space-x-3 pt-2">
							<button
								type="button"
								onClick={onCancel}
								className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										<span>Adding...</span>
									</div>
								) : (
									'Add Subscription'
								)}
							</button>
						</div>
					</form>
				</div>
			</motion.div>
		</div>
	)
}

export default SubscriptionForm 