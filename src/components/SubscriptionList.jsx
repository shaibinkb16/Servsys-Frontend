import React, { useState } from 'react'
import { subscriptionAPI } from '../services/api'

const toSafeText = (value) => {
	if (value == null) return ''
	if (typeof value === 'object') {
		try { return JSON.stringify(value) } catch { return String(value) }
	}
	return String(value)
}

const formatInsightValue = (value) => {
	if (value == null) return ''
	if (Array.isArray(value)) {
		return value.map((v) => formatInsightValue(v)).join(', ')
	}
	if (typeof value === 'object') {
		if (value.description && !value.name) return value.description
		if (value.name && value.cost) return `${value.name} ($${value.cost})${value.description ? `: ${value.description}` : ''}`
		if (value.tips) return Array.isArray(value.tips) ? value.tips.join('. ') : String(value.tips)
		if (value.estimated_savings !== undefined) return value.estimated_savings ? `$${value.estimated_savings}` : 'No savings possible'
		if (value.justification) return value.justification
		return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ')
	}
	return String(value)
}

const AlternativesList = ({ alternatives }) => {
	if (!alternatives || !Array.isArray(alternatives)) return null
	
	return (
		<div className="space-y-2">
			{alternatives.map((alt, idx) => (
				<div key={idx} className="border-l-2 border-blue-200 pl-3">
					<div className="font-medium text-blue-800">
						{alt.name} - ${alt.cost}/month
					</div>
					<div className="text-sm text-gray-600 mb-1">{alt.description}</div>
					<div className="text-xs">
						<div className="text-green-600">
							<strong>Pros:</strong> {alt.pros?.join(', ')}
						</div>
						<div className="text-red-600">
							<strong>Cons:</strong> {alt.cons?.join(', ')}
						</div>
						<div className="text-blue-600">
							<strong>Potential Savings:</strong> ${alt.savings_potential}/month
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

const CostAnalysis = ({ costAnalysis }) => {
	if (!costAnalysis) return null
	
	return (
		<div className="grid grid-cols-2 gap-2 text-sm">
			<div><strong>Monthly:</strong> ${costAnalysis.monthly_equivalent}</div>
			<div><strong>Annual:</strong> ${costAnalysis.annual_total}</div>
			<div><strong>Daily:</strong> ${costAnalysis.cost_per_day}</div>
			<div><strong>Value:</strong> {costAnalysis.value_assessment}</div>
		</div>
	)
}

const Recommendations = ({ recommendations }) => {
	if (!recommendations) return null
	
	const actionColors = {
		keep: 'bg-green-100 text-green-800',
		downgrade: 'bg-yellow-100 text-yellow-800',
		cancel: 'bg-red-100 text-red-800',
		switch: 'bg-blue-100 text-blue-800',
		optimize: 'bg-purple-100 text-purple-800'
	}
	
	return (
		<div className="space-y-2">
			<div className={`inline-block px-2 py-1 rounded text-xs font-medium ${actionColors[recommendations.action] || 'bg-gray-100'}`}>
				{recommendations.action?.toUpperCase()}
			</div>
			<div className="text-sm">{recommendations.reasoning}</div>
			{recommendations.estimated_savings > 0 && (
				<div className="text-green-600 font-medium">
					Potential Savings: ${recommendations.estimated_savings}/month
				</div>
			)}
			{recommendations.implementation_steps && (
				<div className="text-xs">
					<strong>Steps:</strong>
					<ol className="list-decimal list-inside ml-2">
						{recommendations.implementation_steps.map((step, idx) => (
							<li key={idx}>{step}</li>
						))}
					</ol>
				</div>
			)}
		</div>
	)
}

const UsageTips = ({ tips }) => {
	if (!tips || !Array.isArray(tips)) return null
	
	return (
		<div className="text-sm">
			<strong>Usage Tips:</strong>
			<ul className="list-disc list-inside ml-2 space-y-1">
				{tips.map((tip, idx) => (
					<li key={idx}>{tip}</li>
				))}
			</ul>
		</div>
	)
}

const RiskAssessment = ({ risks }) => {
	if (!risks) return null
	
	return (
		<div className="text-xs space-y-1">
			<div><strong>Cancellation Impact:</strong> {risks.cancellation_impact}</div>
			<div><strong>Downgrade Impact:</strong> {risks.downgrade_impact}</div>
			<div><strong>Switching Risks:</strong> {risks.switching_risks}</div>
		</div>
	)
}

const SubscriptionList = ({ subscriptions, onUpdate }) => {
	const [editingId, setEditingId] = useState(null)
	const [editForm, setEditForm] = useState({})
	const [insightFor, setInsightFor] = useState(null)
	const [insights, setInsights] = useState({})

	console.log('SubscriptionList received:', subscriptions)

	const startEdit = (s) => {
		const sid = s._id || s.id
		setEditingId(sid)
		setEditForm({
			service_name: toSafeText(s.service_name),
			cost: Number(s.cost ?? 0),
			billing_cycle: toSafeText(s.billing_cycle),
			renewal_date: toSafeText((s.renewal_date || '').split('T')[0]),
			notes: toSafeText(s.notes || ''),
			is_shared: !!s.is_shared,
			visibility: s.visibility || 'private'
		})
	}

	const saveEdit = async (id) => {
		// Only send allowed fields
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
			onUpdate?.()
		} catch (err) {
			alert('Failed to update subscription')
		}
	}

	const remove = async (id) => {
		if (!confirm('Delete subscription?')) return
		await subscriptionAPI.deleteSubscription(id)
		onUpdate?.()
	}

	const loadInsights = async (id) => {
		const data = await subscriptionAPI.getInsights(id)
		setInsights((prev) => ({ ...prev, [id]: data.insights }))
		setInsightFor(id)
	}

	const fmt = (d) => (d ? new Date(d).toLocaleDateString() : '')

	const getVisibilityBadge = (subscription) => {
		if (subscription.visibility === 'shared' || subscription.is_shared) {
			return <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Shared</span>
		}
		return <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Private</span>
	}

	return (
		<div className="bg-white shadow rounded">
			{subscriptions.length === 0 ? (
				<div className="p-8 text-center text-gray-500">
					<p>No subscriptions found.</p>
					<p className="text-sm mt-2">Add your first subscription to get started!</p>
				</div>
			) : (
				<ul className="divide-y">
					{subscriptions.map((s) => {
						const sid = s._id || s.id
						const insight = insights[sid]
						return (
							<li key={sid} className="p-4">
								{editingId === sid ? (
									<div className="space-y-2">
										<input className="w-full border rounded px-2 py-1" value={editForm.service_name} onChange={(e) => setEditForm({ ...editForm, service_name: e.target.value })} />
										<input className="w-full border rounded px-2 py-1" type="number" value={editForm.cost} onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })} />
										<select className="w-full border rounded px-2 py-1" value={editForm.billing_cycle} onChange={(e) => setEditForm({ ...editForm, billing_cycle: e.target.value })}>
											<option value="monthly">Monthly</option>
											<option value="yearly">Yearly</option>
											<option value="quarterly">Quarterly</option>
											<option value="weekly">Weekly</option>
										</select>
										<input className="w-full border rounded px-2 py-1" type="date" value={editForm.renewal_date} onChange={(e) => setEditForm({ ...editForm, renewal_date: e.target.value })} />
										<select className="w-full border rounded px-2 py-1" value={editForm.visibility} onChange={(e) => setEditForm({ ...editForm, visibility: e.target.value })}>
											<option value="private">Private</option>
											<option value="shared">Shared</option>
										</select>
										<div className="flex items-center space-x-2">
											<input type="checkbox" checked={editForm.is_shared} onChange={(e) => setEditForm({ ...editForm, is_shared: e.target.checked })} />
											<span>Shared (legacy)</span>
										</div>
										<div className="flex space-x-2">
											<button className="px-3 py-1 rounded bg-green-600 text-white" onClick={() => saveEdit(sid)}>Save</button>
											<button className="px-3 py-1 rounded border" onClick={() => setEditingId(null)}>Cancel</button>
										</div>
									</div>
								) : (
									<div className="flex justify-between">
										<div>
											<h3 className="font-medium">
												{toSafeText(s.service_name)} {getVisibilityBadge(s)}
											</h3>
											<p className="text-sm text-gray-600">${Number(s.cost ?? 0)} per {toSafeText(s.billing_cycle)}</p>
											<p className="text-sm text-gray-500">Renews on {fmt(s.renewal_date)}</p>
										</div>
										<div className="flex items-start space-x-2">
											<button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => loadInsights(sid)}>AI Insights</button>
											<button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={() => startEdit(s)}>Edit</button>
											<button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => remove(sid)}>Delete</button>
										</div>
									</div>
								)}
								{insightFor === sid && insight && (
									<div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-4">
										{/* Classification */}
										<div className="border-b pb-2">
											<h4 className="font-semibold text-gray-800 mb-2">Classification</h4>
											<div className="grid grid-cols-2 gap-2 text-sm">
												<div><strong>Category:</strong> {insight.classification?.category}</div>
												<div><strong>Necessity:</strong> {insight.classification?.necessity_level}</div>
											</div>
											<div className="text-sm text-gray-600 mt-1">
												{insight.classification?.reasoning}
											</div>
										</div>

										{/* Cost Analysis */}
										<div className="border-b pb-2">
											<h4 className="font-semibold text-gray-800 mb-2">Cost Analysis</h4>
											<CostAnalysis costAnalysis={insight.cost_analysis} />
											<div className="text-sm text-gray-600 mt-1">
												{insight.cost_analysis?.cost_justification}
											</div>
										</div>

										{/* Recommendations */}
										<div className="border-b pb-2">
											<h4 className="font-semibold text-gray-800 mb-2">Recommendations</h4>
											<Recommendations recommendations={insight.recommendations} />
										</div>

										{/* Alternatives */}
										{insight.alternatives && insight.alternatives.length > 0 && (
											<div className="border-b pb-2">
												<h4 className="font-semibold text-gray-800 mb-2">Alternatives</h4>
												<AlternativesList alternatives={insight.alternatives} />
											</div>
										)}

										{/* Usage Tips */}
										<div className="border-b pb-2">
											<h4 className="font-semibold text-gray-800 mb-2">Usage Tips</h4>
											<UsageTips tips={insight.usage_tips} />
										</div>

										{/* Risk Assessment */}
										<div>
											<h4 className="font-semibold text-gray-800 mb-2">Risk Assessment</h4>
											<RiskAssessment risks={insight.risk_assessment} />
										</div>
									</div>
								)}
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}

export default SubscriptionList