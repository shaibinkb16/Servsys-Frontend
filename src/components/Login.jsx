import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	})
	const [showPassword, setShowPassword] = useState(false)
	const [rememberMe, setRememberMe] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	
	const { login } = useAuth()
	const navigate = useNavigate()

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			await login(formData.email, formData.password)
			navigate('/')
		} catch (err) {
			setError('Invalid email or password')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-white flex items-center justify-center p-4">
			{/* Main Container */}
			<div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
				<div className="flex">
					{/* Left Panel - Form */}
					<div className="flex-1 p-12 lg:p-16">
						<div className="max-w-lg mx-auto">
							{/* Header */}
							<div className="mb-10">
								<h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">Hello!</h1>
								<p className="text-gray-600 text-xl">Sign in to your subscription dashboard</p>
							</div>

							{/* Error Message */}
							{error && (
								<div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
									<p className="text-red-600 text-sm">{error}</p>
								</div>
							)}

							{/* Form */}
							<form onSubmit={handleSubmit} className="space-y-8">
								{/* Email Field */}
								<div>
									<div className="relative">
										<div className="absolute left-4 top-1/2 transform -translate-y-1/2">
											<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
											</svg>
										</div>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											placeholder="E-mail"
											required
											className="w-full pl-14 pr-4 py-5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
										/>
									</div>
								</div>

								{/* Password Field */}
								<div>
									<div className="relative">
										<div className="absolute left-4 top-1/2 transform -translate-y-1/2">
											<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
											</svg>
										</div>
										<input
											type={showPassword ? 'text' : 'password'}
											name="password"
											value={formData.password}
											onChange={handleChange}
											placeholder="Password"
											required
											className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-4 top-1/2 transform -translate-y-1/2"
										>
											<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												{showPassword ? (
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
												) : (
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												)}
											</svg>
										</button>
									</div>
								</div>

								{/* Remember Me & Forgot Password */}
								<div className="flex items-center justify-between">
									<label className="flex items-center space-x-3 cursor-pointer">
										<input
											type="checkbox"
											checked={rememberMe}
											onChange={(e) => setRememberMe(e.target.checked)}
											className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
										/>
										<span className="text-gray-700 text-lg">Remember me</span>
									</label>
									<Link to="/forgot-password" className="text-purple-600 hover:text-purple-700 text-lg font-medium transition-colors">
										Forgot password?
									</Link>
								</div>

								{/* Sign In Button */}
								<button
									type="submit"
									disabled={loading}
									className="w-full py-5 bg-gradient-to-b from-purple-400 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-xl"
								>
									{loading ? (
										<div className="flex items-center justify-center space-x-3">
											<svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											<span>SIGNING IN...</span>
										</div>
									) : (
										'SIGN IN'
									)}
								</button>
							</form>
						</div>
					</div>

					{/* Right Panel - Welcome */}
					<div className="hidden lg:block lg:w-1/2 bg-gradient-to-b from-purple-400 to-purple-600 p-12 lg:p-16 flex items-center justify-center">
						<div className="text-center text-white max-w-md">
							<h2 className="text-4xl lg:text-5xl font-bold mb-6">Welcome Back!</h2>
							<p className="text-purple-100 text-xl leading-relaxed mb-8">
								Take control of your subscriptions and never miss a renewal again. Track costs, get smart insights, and optimize your spending with our powerful subscription management platform.
							</p>
							
							{/* Feature Highlights */}
							<div className="space-y-4 text-left">
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<span className="text-purple-100">Smart renewal reminders</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
										</svg>
									</div>
									<span className="text-purple-100">Cost analysis & insights</span>
								</div>
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
										<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
										</svg>
									</div>
									<span className="text-purple-100">Save money with AI recommendations</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Background Decorations */}
			<div className="fixed inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50"></div>
				<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50"></div>
			</div>
		</div>
	)
}

export default Login
