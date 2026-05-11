const METRICS_ENDPOINT = 'https://xl6lw3xjrg.execute-api.eu-central-1.amazonaws.com/prod/metrics'

const ALLOWED_EVENTS = new Set([
  'lab_viewed',
  'workflow_selected',
  'risk_profile_changed',
  'evidence_view_opened',
  'evidence_kit_clicked',
  'sandbox_request_clicked',
  'technical_call_clicked'
])

const WORKFLOW_SLUGS = {
  'contact-center-call': 'contact_center',
  'crm-support-note': 'crm_support',
  'hr-internal-note': 'hr_internal',
  'healthcare-admin-note': 'healthcare_admin',
  'financial-services-support-note': 'financial_services_support'
}

const RISK_CATEGORY_SLUGS = {
  names: 'names',
  email: 'email',
  phone: 'phone',
  address: 'address',
  dates: 'dates',
  referenceIds: 'reference_ids'
}

const VIEW_MODE_SLUGS = {
  output: 'minimized_output',
  evidence: 'evidence'
}

function normalizeUtmValue(value) {
  if (!value) {
    return 'unknown'
  }

  const normalized = value.trim().toLowerCase()
  return /^[a-z0-9][a-z0-9._-]{0,63}$/.test(normalized) ? normalized : 'unknown'
}

function hashQueryParams(hash) {
  const queryStart = hash.indexOf('?')
  if (queryStart === -1) {
    return new URLSearchParams()
  }

  // Support links copied as /#demo?utm_source=... where the query lives in the hash.
  return new URLSearchParams(hash.slice(queryStart + 1))
}

function utmContext() {
  if (typeof window === 'undefined') {
    return {
      utm_source: 'unknown',
      utm_campaign: 'unknown'
    }
  }

  const searchParams = new URLSearchParams(window.location.search)
  const hashParams = hashQueryParams(window.location.hash)
  const paramValue = (name) =>
    searchParams.has(name) ? searchParams.get(name) : hashParams.get(name)

  return {
    utm_source: normalizeUtmValue(paramValue('utm_source')),
    utm_campaign: normalizeUtmValue(paramValue('utm_campaign'))
  }
}

function workflowSlugFor(workflowId) {
  return WORKFLOW_SLUGS[workflowId] || 'unknown'
}

function riskCategorySlugsFor(riskCategoryIds) {
  if (!Array.isArray(riskCategoryIds)) {
    return []
  }

  return riskCategoryIds
    .map((categoryId) => RISK_CATEGORY_SLUGS[categoryId])
    .filter(Boolean)
}

function viewModeSlugFor(viewMode) {
  return VIEW_MODE_SLUGS[viewMode] || 'unknown'
}

export function trackLabMetric(event, { workflowId, riskCategoryIds, viewMode } = {}) {
  if (!ALLOWED_EVENTS.has(event) || typeof fetch !== 'function') {
    return
  }

  const { utm_source, utm_campaign } = utmContext()
  const payload = {
    event,
    workflow: workflowSlugFor(workflowId),
    risk_categories: riskCategorySlugsFor(riskCategoryIds),
    view_mode: viewModeSlugFor(viewMode),
    utm_source,
    utm_campaign
  }

  try {
    void fetch(METRICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'omit',
      keepalive: true,
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(payload)
    }).catch(() => {})
  } catch {
    // Metrics must never affect the public demo.
  }
}
