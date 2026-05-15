import { getFirstPartyAttribution } from './metrics'

export const SANDBOX_REQUEST_ENDPOINT =
  'https://xl6lw3xjrg.execute-api.eu-central-1.amazonaws.com/prod/sandbox-request'

export const WORKFLOW_CATEGORY_OPTIONS = [
  { value: 'contact_center', label: 'Contact center' },
  { value: 'crm_support', label: 'CRM support' },
  { value: 'hr_internal', label: 'HR/internal' },
  { value: 'healthcare_admin', label: 'Healthcare admin' },
  { value: 'financial_services_support', label: 'Financial services support' },
  { value: 'other', label: 'Other' },
  { value: 'unknown', label: 'Not sure yet' }
]

const CONTROL_CHARS_RE = /[\u0000-\u001f\u007f-\u009f]/g
const EXCESSIVE_WHITESPACE_RE = /\s+/g
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeSandboxText(value, maxLength) {
  const normalized = String(value || '')
    .replace(CONTROL_CHARS_RE, '')
    .trim()
    .replace(EXCESSIVE_WHITESPACE_RE, ' ')

  return {
    value: normalized,
    valid: normalized.length <= maxLength
  }
}

export function normalizeSandboxIntent(value) {
  return normalizeSandboxText(value, 500)
}

export function buildSandboxRequestPayload(formValues) {
  const email = String(formValues.email || '').trim().toLowerCase()
  const company = normalizeSandboxText(formValues.company, 120)
  const role = normalizeSandboxText(formValues.role, 120)
  const intent = normalizeSandboxIntent(formValues.intent)
  const workflowCategory = String(formValues.workflowCategory || '')
  const acceptedTerms = formValues.acceptedTerms === true
  const attribution = getFirstPartyAttribution()

  const errors = []

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    errors.push('email')
  }

  if (!WORKFLOW_CATEGORY_OPTIONS.some((option) => option.value === workflowCategory)) {
    errors.push('workflow_category')
  }

  if (!acceptedTerms) {
    errors.push('accepted_terms')
  }

  if (!company.valid) {
    errors.push('company')
  }

  if (!role.valid) {
    errors.push('role')
  }

  if (!intent.valid) {
    errors.push('intent')
  }

  return {
    ok: errors.length === 0,
    errors,
    payload: {
      email,
      company: company.value,
      role: role.value,
      workflow_category: workflowCategory,
      intent: intent.value,
      accepted_terms: acceptedTerms,
      s_src: attribution.s_src,
      s_cmp: attribution.s_cmp
    }
  }
}

export async function submitSandboxAccessRequest(formValues) {
  const built = buildSandboxRequestPayload(formValues)

  if (!built.ok) {
    return {
      ok: false,
      kind: 'validation',
      errors: built.errors
    }
  }

  const response = await fetch(SANDBOX_REQUEST_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(built.payload)
  })

  if (!response.ok) {
    return {
      ok: false,
      kind: response.status >= 400 && response.status < 500 ? 'validation' : 'server'
    }
  }

  return {
    ok: true
  }
}
