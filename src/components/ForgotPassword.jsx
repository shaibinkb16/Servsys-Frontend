import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
	const [step, setStep] = useState(1) // 1: email, 2: OTP, 3: new password, 4: success
	const [email, setEmail] = useState('')
	const [otp, setOtp] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [message, setMessage] = useState('')
	
	const navigate = useNavigate()

	const handleSendOTP = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')
		
		try {
			const response = await fetch('http://localhost:8000/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			})
			
			const data = await response.json()
			
			if (response.ok) {
				setMessage('Password reset code sent to your email')
				setStep(2)
			} else {
				setError(data.detail || 'Failed to send reset code')
			}
		} catch (err) {
			setError('Network error. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleVerifyOTP = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')
		
		try {
			const response = await fetch('http://localhost:8000/auth/verify-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, otp })
			})
			
			const data = await response.json()
			
			if (response.ok) {
				setStep(3)
			} else {
				setError(data.detail || 'Invalid OTP')
			}
		} catch (err) {
			setError('Network error. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleResetPassword = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')
		
		try {
			const response = await fetch('http://localhost:8000/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, otp, new_password: newPassword })
			})
			
			const data = await response.json()
			
			if (response.ok) {
				setStep(4)
			} else {
				setError(data.detail || 'Failed to reset password')
			}
		} catch (err) {
			setError('Network error. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleBack = () => {
		if (step > 1) {
			setStep(step - 1)
			setError('')
			setMessage('')
		} else {
			navigate('/login')
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
			{/* Main Container */}
			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-center text-white">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2 }}
						className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
					>
						<Lock className="w-8 h-8" />
					</motion.div>
					<h1 className="text-2xl font-bold mb-2">Reset Password</h1>
					<p className="text-purple-100">Follow the steps to reset your password</p>
				</div>

				{/* Content */}
				<div className="p-8">
					{/* Back Button */}
					<button
						onClick={handleBack}
						className="flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back
					</button>

					{/* Step Indicator */}
					<div className="flex items-center justify-center mb-8">
						{[1, 2, 3, 4].map((stepNumber) => (
							<div key={stepNumber} className="flex items-center">
								<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
									stepNumber < step 
										? 'bg-green-500 text-white' 
										: stepNumber === step 
										? 'bg-purple-500 text-white' 
										: 'bg-gray-200 text-gray-500'
								}`}>
									{stepNumber < step ? <CheckCircle className="w-4 h-4" /> : stepNumber}
								</div>
								{stepNumber < 4 && (
									<div className={`w-12 h-1 mx-2 ${
										stepNumber < step ? 'bg-green-500' : 'bg-gray-200'
									}`} />
								)}
							</div>
						))}
					</div>

					<AnimatePresence mode="wait">
						{/* Step 1: Email */}
						{step === 1 && (
							<motion.form
								key="step1"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								onSubmit={handleSendOTP}
								className="space-y-6"
							>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Email Address
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											placeholder="Enter your email"
											required
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
										/>
									</div>
								</div>

								<button
									type="submit"
									disabled={loading}
									className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50"
								>
									{loading ? 'Sending...' : 'Send Reset Code'}
								</button>
							</motion.form>
						)}

						{/* Step 2: OTP */}
						{step === 2 && (
							<motion.form
								key="step2"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								onSubmit={handleVerifyOTP}
								className="space-y-6"
							>
								<div className="text-center">
									<p className="text-gray-600 mb-4">
										We've sent a 6-digit code to <strong>{email}</strong>
									</p>
									<div className="bg-purple-50 p-4 rounded-xl">
										<p className="text-sm text-purple-700">
											Check your email and enter the code below
										</p>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Verification Code
									</label>
									<input
										type="text"
										value={otp}
										onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
										placeholder="000000"
										maxLength={6}
										required
										className="w-full text-center text-2xl font-mono tracking-widest py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
									/>
								</div>

								<button
									type="submit"
									disabled={loading || otp.length !== 6}
									className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50"
								>
									{loading ? 'Verifying...' : 'Verify Code'}
								</button>
							</motion.form>
						)}

						{/* Step 3: New Password */}
						{step === 3 && (
							<motion.form
								key="step3"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								onSubmit={handleResetPassword}
								className="space-y-6"
							>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										New Password
									</label>
									<div className="relative">
										<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											type={showPassword ? 'text' : 'password'}
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											placeholder="Enter new password"
											required
											minLength={6}
											className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 transform -translate-y-1/2"
										>
											{showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
										</button>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Password must be at least 6 characters long
									</p>
								</div>

								<button
									type="submit"
									disabled={loading || newPassword.length < 6}
									className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50"
								>
									{loading ? 'Resetting...' : 'Reset Password'}
								</button>
							</motion.form>
						)}

						{/* Step 4: Success */}
						{step === 4 && (
							<motion.div
								key="step4"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="text-center space-y-6"
							>
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.2 }}
									className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center"
								>
									<CheckCircle className="w-8 h-8 text-green-600" />
								</motion.div>
								
								<div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										Password Reset Successful!
									</h3>
									<p className="text-gray-600">
										Your password has been successfully reset. You can now log in with your new password.
									</p>
								</div>

								<button
									onClick={() => navigate('/login')}
									className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
								>
									Go to Login
								</button>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Error Message */}
					<AnimatePresence>
						{error && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center"
							>
								<AlertCircle className="w-5 h-5 text-red-500 mr-2" />
								<span className="text-red-700 text-sm">{error}</span>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Success Message */}
					<AnimatePresence>
						{message && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center"
							>
								<CheckCircle className="w-5 h-5 text-green-500 mr-2" />
								<span className="text-green-700 text-sm">{message}</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.div>
		</div>
	)
}

export default ForgotPassword 