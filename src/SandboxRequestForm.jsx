import React, { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'
import {
  WORKFLOW_CATEGORY_OPTIONS,
  normalizeSandboxIntent,
  submitSandboxAccessRequest
} from './sandboxRequest'

const INITIAL_FORM = {
  email: '',
  company: '',
  role: '',
  workflowCategory: '',
  intent: '',
  acceptedTerms: false
}

const SUCCESS_MESSAGE =
  'Request received. Please check your email to verify the request. After verification, the request will be reviewed manually.'
const VALIDATION_MESSAGE = 'Check the required fields and field lengths, then try again.'
const FAILURE_MESSAGE = 'The request could not be submitted. You can still contact us by email.'

export default function SandboxRequestForm({ fallbackHref, onSubmitAttempt, onFallbackClick }) {
  const [formValues, setFormValues] = useState(INITIAL_FORM)
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' })
  const [isSending, setIsSending] = useState(false)

  const normalizedIntent = useMemo(() => normalizeSandboxIntent(formValues.intent), [formValues.intent])
  const intentLength = normalizedIntent.value.length

  const updateField = (fieldName, value) => {
    setFormValues((current) => ({
      ...current,
      [fieldName]: value
    }))

    if (submitState.status !== 'idle') {
      setSubmitState({ status: 'idle', message: '' })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSending) {
      return
    }

    setIsSending(true)
    setSubmitState({ status: 'idle', message: '' })
    onSubmitAttempt?.()

    try {
      const result = await submitSandboxAccessRequest(formValues)

      if (result.ok) {
        setSubmitState({ status: 'success', message: SUCCESS_MESSAGE })
        return
      }

      setSubmitState({
        status: 'error',
        message: result.kind === 'validation' ? VALIDATION_MESSAGE : FAILURE_MESSAGE
      })
    } catch {
      setSubmitState({ status: 'error', message: FAILURE_MESSAGE })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="sandbox-email" className="block mono text-sm font-bold text-gray-900 mb-2">
          Work email
        </label>
        <input
          id="sandbox-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          value={formValues.email}
          onChange={(event) => updateField('email', event.target.value)}
          className="w-full rounded-xl border-2 border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sandbox-company" className="block mono text-sm font-bold text-gray-900 mb-2">
            Company
          </label>
          <input
            id="sandbox-company"
            name="company"
            type="text"
            maxLength={120}
            autoComplete="organization"
            value={formValues.company}
            onChange={(event) => updateField('company', event.target.value)}
            className="w-full rounded-xl border-2 border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-blue-600"
          />
        </div>

        <div>
          <label htmlFor="sandbox-role" className="block mono text-sm font-bold text-gray-900 mb-2">
            Role
          </label>
          <input
            id="sandbox-role"
            name="role"
            type="text"
            maxLength={120}
            autoComplete="organization-title"
            value={formValues.role}
            onChange={(event) => updateField('role', event.target.value)}
            className="w-full rounded-xl border-2 border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-blue-600"
          />
        </div>
      </div>

      <div>
        <label htmlFor="sandbox-workflow-category" className="block mono text-sm font-bold text-gray-900 mb-2">
          Workflow category
        </label>
        <select
          id="sandbox-workflow-category"
          name="workflow_category"
          required
          value={formValues.workflowCategory}
          onChange={(event) => updateField('workflowCategory', event.target.value)}
          className="w-full rounded-xl border-2 border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-blue-600"
        >
          <option value="">Select workflow category</option>
          {WORKFLOW_CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between gap-4 mb-2">
          <label htmlFor="sandbox-intent" className="block mono text-sm font-bold text-gray-900">
            Brief use case
          </label>
          <span className={`mono text-xs font-bold ${intentLength > 500 ? 'text-red-700' : 'text-gray-600'}`}>
            {intentLength}/500
          </span>
        </div>
        <textarea
          id="sandbox-intent"
          name="intent"
          rows={4}
          maxLength={500}
          value={formValues.intent}
          onChange={(event) => updateField('intent', event.target.value)}
          placeholder="Briefly describe what workflow you want to test, using synthetic or non-confidential data only."
          className="w-full resize-y rounded-xl border-2 border-blue-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-blue-600"
        />
        <p className="mt-2 text-sm font-semibold text-gray-700">
          Do not include personal, customer, employee, patient, financial, or confidential data.
        </p>
      </div>

      <label className="flex items-start gap-3 text-gray-800 font-semibold">
        <input
          type="checkbox"
          required
          checked={formValues.acceptedTerms}
          onChange={(event) => updateField('acceptedTerms', event.target.checked)}
          className="mt-1 h-5 w-5 rounded border-2 border-blue-300 text-blue-600 focus:ring-blue-600"
        />
        <span>
          I understand this request is for controlled testing with synthetic or non-confidential data only.
        </span>
      </label>

      <p className="text-sm text-gray-700 leading-relaxed">
        Synthector stores the request details you submit so the request can be verified and reviewed. Do not include sensitive or confidential data in this form.
      </p>

      {submitState.message && (
        <div
          className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold ${
            submitState.status === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
          role="status"
          aria-live="polite"
        >
          {submitState.status === 'success' && <CheckCircle className="inline-block w-4 h-4 mr-2" />}
          {submitState.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          type="submit"
          disabled={isSending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-wait text-white px-8 py-5 rounded-xl font-bold text-base sm:text-lg leading-snug transition-all hover:scale-105 inline-flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 glow text-left sm:text-center"
        >
          <span>{isSending ? 'Sending request...' : 'Request controlled sandbox access'}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
        <a
          href={fallbackHref}
          onClick={onFallbackClick}
          className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 text-gray-900 px-8 py-5 rounded-xl font-bold text-base sm:text-lg leading-snug transition-all inline-flex items-center justify-center gap-3 mono"
        >
          Email fallback
        </a>
      </div>
    </form>
  )
}
