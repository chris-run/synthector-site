import React, { useEffect, useState } from 'react'
import { Shield, Lock, CheckCircle, ArrowRight, Zap, FileText, Eye, Database, ExternalLink } from 'lucide-react'
import { trackLabMetric } from './metrics'
import SandboxRequestForm from './SandboxRequestForm'

const CONTACT_EMAIL = 'contact@synthector.com'

const RISK_CATEGORIES = [
  { id: 'names', label: 'Names' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'address', label: 'Address' },
  { id: 'dates', label: 'Dates' },
  { id: 'referenceIds', label: 'Reference/account IDs' }
]

const DEFAULT_RISK_CATEGORY_IDS = RISK_CATEGORIES.map((category) => category.id)

const WORKFLOW_LAB_EXAMPLES = [
  {
    id: 'contact-center-call',
    label: 'Contact center call',
    original:
      'Contact center call: Agent confirms caller Maya Chen on account MC-44219. Callback is (415) 555-0184, email is maya.chen@example.test, service address is 118 Harbor Lane Apt 4, Redwood City CA 94063, and follow-up is scheduled for June 14.',
    minimized:
      'Contact center call: Agent confirms caller [PERSON_1] on account [ACCOUNT_ID_1]. Callback is [PHONE_1], email is [EMAIL_1], service address is [ADDRESS_1], and follow-up is scheduled for [DATE_1].',
    categoryCounts: {
      names: 1,
      email: 1,
      phone: 1,
      address: 1,
      dates: 1,
      referenceIds: 1
    },
    segments: [
      { text: 'Contact center call: Agent confirms caller ' },
      { category: 'names', raw: 'Maya Chen', placeholder: '[PERSON_1]' },
      { text: ' on account ' },
      { category: 'referenceIds', raw: 'MC-44219', placeholder: '[ACCOUNT_ID_1]' },
      { text: '. Callback is ' },
      { category: 'phone', raw: '(415) 555-0184', placeholder: '[PHONE_1]' },
      { text: ', email is ' },
      { category: 'email', raw: 'maya.chen@example.test', placeholder: '[EMAIL_1]' },
      { text: ', service address is ' },
      { category: 'address', raw: '118 Harbor Lane Apt 4, Redwood City CA 94063', placeholder: '[ADDRESS_1]' },
      { text: ', and follow-up is scheduled for ' },
      { category: 'dates', raw: 'June 14', placeholder: '[DATE_1]' },
      { text: '.' }
    ],
    leakStatus: 'Demo pass: full synthetic risk profile is minimized in the preview.',
    receiptMetadata: {
      workflow_id: 'contact-center-call',
      ruleset_version: 'lab-static-v1',
      leak_status: 'pass',
      evidence_scope: 'metadata_only',
      attestation_mode: 'illustrative_demo'
    }
  },
  {
    id: 'crm-support-note',
    label: 'CRM support note',
    original:
      'CRM support note: Jordan Reed from Acme Cloud Trial asked support to attach email jordan.reed@example.test to case CRM-7782. Renewal quote Q-20491 is due on July 2. No phone or address was provided.',
    minimized:
      'CRM support note: [PERSON_1] from Acme Cloud Trial asked support to attach email [EMAIL_1] to case [CASE_ID_1]. Renewal quote [QUOTE_ID_1] is due on [DATE_1]. No phone or address was provided.',
    categoryCounts: {
      names: 1,
      email: 1,
      phone: 0,
      address: 0,
      dates: 1,
      referenceIds: 2
    },
    segments: [
      { text: 'CRM support note: ' },
      { category: 'names', raw: 'Jordan Reed', placeholder: '[PERSON_1]' },
      { text: ' from Acme Cloud Trial asked support to attach email ' },
      { category: 'email', raw: 'jordan.reed@example.test', placeholder: '[EMAIL_1]' },
      { text: ' to case ' },
      { category: 'referenceIds', raw: 'CRM-7782', placeholder: '[CASE_ID_1]' },
      { text: '. Renewal quote ' },
      { category: 'referenceIds', raw: 'Q-20491', placeholder: '[QUOTE_ID_1]' },
      { text: ' is due on ' },
      { category: 'dates', raw: 'July 2', placeholder: '[DATE_1]' },
      { text: '. No phone or address was provided.' }
    ],
    leakStatus: 'Demo pass: selected synthetic identifiers are represented as placeholders.',
    receiptMetadata: {
      workflow_id: 'crm-support-note',
      ruleset_version: 'lab-static-v1',
      leak_status: 'pass',
      evidence_scope: 'metadata_only',
      attestation_mode: 'illustrative_demo'
    }
  },
  {
    id: 'hr-internal-note',
    label: 'HR/internal note',
    original:
      'HR/internal note: Priya N. requested schedule coverage on March 18. Employee record E-10488 lists backup Sam Ortiz and home office address 77 Cedar Row Suite 9. HR reply should go to priya.n@example.test.',
    minimized:
      'HR/internal note: [EMPLOYEE_1] requested schedule coverage on [DATE_1]. Employee record [EMPLOYEE_ID_1] lists backup [PERSON_2] and home office address [ADDRESS_1]. HR reply should go to [EMAIL_1].',
    categoryCounts: {
      names: 2,
      email: 1,
      phone: 0,
      address: 1,
      dates: 1,
      referenceIds: 1
    },
    segments: [
      { text: 'HR/internal note: ' },
      { category: 'names', raw: 'Priya N.', placeholder: '[EMPLOYEE_1]' },
      { text: ' requested schedule coverage on ' },
      { category: 'dates', raw: 'March 18', placeholder: '[DATE_1]' },
      { text: '. Employee record ' },
      { category: 'referenceIds', raw: 'E-10488', placeholder: '[EMPLOYEE_ID_1]' },
      { text: ' lists backup ' },
      { category: 'names', raw: 'Sam Ortiz', placeholder: '[PERSON_2]' },
      { text: ' and home office address ' },
      { category: 'address', raw: '77 Cedar Row Suite 9', placeholder: '[ADDRESS_1]' },
      { text: '. HR reply should go to ' },
      { category: 'email', raw: 'priya.n@example.test', placeholder: '[EMAIL_1]' },
      { text: '.' }
    ],
    leakStatus: 'Demo pass: employee-facing synthetic fields are minimized in this preview.',
    receiptMetadata: {
      workflow_id: 'hr-internal-note',
      ruleset_version: 'lab-static-v1',
      leak_status: 'pass',
      evidence_scope: 'metadata_only',
      attestation_mode: 'illustrative_demo'
    }
  },
  {
    id: 'healthcare-admin-note',
    label: 'Healthcare admin note',
    original:
      'Healthcare admin note: Intake coordinator Lina Brooks called clinic operations about appointment REF-8821 for April 9. Contact email is lina.brooks@example.test, phone is (303) 555-0199, and mailing address is 420 Aspen Circle, Boulder CO 80302.',
    minimized:
      'Healthcare admin note: Intake coordinator [PERSON_1] called clinic operations about appointment [REFERENCE_ID_1] for [DATE_1]. Contact email is [EMAIL_1], phone is [PHONE_1], and mailing address is [ADDRESS_1].',
    categoryCounts: {
      names: 1,
      email: 1,
      phone: 1,
      address: 1,
      dates: 1,
      referenceIds: 1
    },
    segments: [
      { text: 'Healthcare admin note: Intake coordinator ' },
      { category: 'names', raw: 'Lina Brooks', placeholder: '[PERSON_1]' },
      { text: ' called clinic operations about appointment ' },
      { category: 'referenceIds', raw: 'REF-8821', placeholder: '[REFERENCE_ID_1]' },
      { text: ' for ' },
      { category: 'dates', raw: 'April 9', placeholder: '[DATE_1]' },
      { text: '. Contact email is ' },
      { category: 'email', raw: 'lina.brooks@example.test', placeholder: '[EMAIL_1]' },
      { text: ', phone is ' },
      { category: 'phone', raw: '(303) 555-0199', placeholder: '[PHONE_1]' },
      { text: ', and mailing address is ' },
      { category: 'address', raw: '420 Aspen Circle, Boulder CO 80302', placeholder: '[ADDRESS_1]' },
      { text: '.' }
    ],
    leakStatus: 'Demo pass: administrative synthetic fields are minimized in the preview.',
    receiptMetadata: {
      workflow_id: 'healthcare-admin-note',
      ruleset_version: 'lab-static-v1',
      leak_status: 'pass',
      evidence_scope: 'metadata_only',
      attestation_mode: 'illustrative_demo'
    }
  },
  {
    id: 'financial-services-support-note',
    label: 'Financial services support note',
    original:
      'Financial services support note: Omar Patel asked Cardwell Credit Union support about case FS-7310 on May 5. Preferred phone is (646) 555-0133, email is omar.patel@example.test, mailing address is 88 Market Street Floor 12, New York NY 10005, and account ending 9012 was mentioned.',
    minimized:
      'Financial services support note: [PERSON_1] asked Cardwell Credit Union support about case [CASE_ID_1] on [DATE_1]. Preferred phone is [PHONE_1], email is [EMAIL_1], mailing address is [ADDRESS_1], and [ACCOUNT_HINT_1] was mentioned.',
    categoryCounts: {
      names: 1,
      email: 1,
      phone: 1,
      address: 1,
      dates: 1,
      referenceIds: 2
    },
    segments: [
      { text: 'Financial services support note: ' },
      { category: 'names', raw: 'Omar Patel', placeholder: '[PERSON_1]' },
      { text: ' asked Cardwell Credit Union support about case ' },
      { category: 'referenceIds', raw: 'FS-7310', placeholder: '[CASE_ID_1]' },
      { text: ' on ' },
      { category: 'dates', raw: 'May 5', placeholder: '[DATE_1]' },
      { text: '. Preferred phone is ' },
      { category: 'phone', raw: '(646) 555-0133', placeholder: '[PHONE_1]' },
      { text: ', email is ' },
      { category: 'email', raw: 'omar.patel@example.test', placeholder: '[EMAIL_1]' },
      { text: ', mailing address is ' },
      { category: 'address', raw: '88 Market Street Floor 12, New York NY 10005', placeholder: '[ADDRESS_1]' },
      { text: ', and ' },
      { category: 'referenceIds', raw: 'account ending 9012', placeholder: '[ACCOUNT_HINT_1]' },
      { text: ' was mentioned.' }
    ],
    leakStatus: 'Demo pass: financial-support synthetic references are minimized in the preview.',
    receiptMetadata: {
      workflow_id: 'financial-services-support-note',
      ruleset_version: 'lab-static-v1',
      leak_status: 'pass',
      evidence_scope: 'metadata_only',
      attestation_mode: 'illustrative_demo'
    }
  }
]

function totalCount(counts) {
  return Object.values(counts).reduce((sum, count) => sum + count, 0)
}

function allRiskCategoriesEnabled(activeRiskCategories) {
  return RISK_CATEGORIES.every((category) => activeRiskCategories.includes(category.id))
}

function workflowOutput(workflow, activeRiskCategories) {
  if (allRiskCategoriesEnabled(activeRiskCategories)) {
    return workflow.minimized
  }

  return workflow.segments
    .map((segment) => {
      if (!segment.category) {
        return segment.text
      }

      return activeRiskCategories.includes(segment.category) ? segment.placeholder : segment.raw
    })
    .join('')
}

function categoryCountsFor(workflow, activeRiskCategories) {
  return RISK_CATEGORIES.reduce((counts, category) => {
    counts[category.id] = activeRiskCategories.includes(category.id)
      ? workflow.categoryCounts[category.id] || 0
      : 0
    return counts
  }, {})
}

function leakStatusFor(workflow, activeRiskCategories) {
  if (allRiskCategoriesEnabled(activeRiskCategories)) {
    return workflow.leakStatus
  }

  return 'Illustrative partial profile: categories switched off remain visible in this static preview.'
}

function receiptPreview(workflow, activeRiskCategories) {
  const entitiesByType = categoryCountsFor(workflow, activeRiskCategories)

  return {
    ...workflow.receiptMetadata,
    leak_status: allRiskCategoriesEnabled(activeRiskCategories) ? 'pass' : 'partial_profile_preview',
    selected_categories: activeRiskCategories,
    entities_total: totalCount(entitiesByType),
    entities_by_type: entitiesByType
  }
}

function mailto(subject) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
}

let labViewMetricSent = false

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(WORKFLOW_LAB_EXAMPLES[0].id)
  const [activeRiskCategories, setActiveRiskCategories] = useState(DEFAULT_RISK_CATEGORY_IDS)
  const [demoViewMode, setDemoViewMode] = useState('output')

  const selectedWorkflow =
    WORKFLOW_LAB_EXAMPLES.find((workflow) => workflow.id === selectedWorkflowId) || WORKFLOW_LAB_EXAMPLES[0]
  const selectedCounts = categoryCountsFor(selectedWorkflow, activeRiskCategories)
  const selectedOutput = workflowOutput(selectedWorkflow, activeRiskCategories)
  const selectedLeakStatus = leakStatusFor(selectedWorkflow, activeRiskCategories)
  const selectedReceipt = receiptPreview(selectedWorkflow, activeRiskCategories)

  const metricContext = (overrides = {}) => ({
    workflowId: overrides.workflowId ?? selectedWorkflowId,
    riskCategoryIds: overrides.riskCategoryIds ?? activeRiskCategories,
    viewMode: overrides.viewMode ?? demoViewMode
  })

  const trackCurrentLabMetric = (event, overrides) => {
    trackLabMetric(event, metricContext(overrides))
  }

  const selectWorkflow = (workflowId) => {
    if (workflowId === selectedWorkflowId) {
      return
    }

    setSelectedWorkflowId(workflowId)
    trackCurrentLabMetric('workflow_selected', { workflowId })
  }

  const toggleRiskCategory = (categoryId) => {
    const nextRiskCategories = activeRiskCategories.includes(categoryId)
      ? activeRiskCategories.filter((currentCategory) => currentCategory !== categoryId)
      : [...activeRiskCategories, categoryId]

    setActiveRiskCategories(nextRiskCategories)
    trackCurrentLabMetric('risk_profile_changed', { riskCategoryIds: nextRiskCategories })
  }

  const selectDemoViewMode = (viewMode) => {
    if (viewMode === demoViewMode) {
      return
    }

    setDemoViewMode(viewMode)

    if (viewMode === 'evidence') {
      trackCurrentLabMetric('evidence_view_opened', { viewMode })
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (labViewMetricSent) {
      return
    }

    labViewMetricSent = true
    trackLabMetric('lab_viewed', {
      workflowId: WORKFLOW_LAB_EXAMPLES[0].id,
      riskCategoryIds: DEFAULT_RISK_CATEGORY_IDS,
      viewMode: 'output'
    })
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-lg border-b-2 border-gray-200 shadow-sm'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
        aria-label="Primary"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-3 justify-between items-center">
          <a href="#top" className="flex items-center space-x-3 min-w-0" aria-label="Synthector home">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center glow flex-shrink-0">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold mono tracking-tight text-gray-900 truncate">
              SYNTHECTOR
            </span>
          </a>

          <div className="hidden md:flex space-x-8 mono text-sm font-semibold text-gray-700">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-blue-600 transition-colors">Demo</a>
            <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
          </div>

          <a
            href={mailto('Synthector Pilot Request')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all hover:scale-105 mono text-sm shadow-lg shadow-blue-600/30 whitespace-nowrap"
          >
            Get pilot access
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="top" className="relative pt-28 pb-16 px-6 grid-bg overflow-hidden">
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Dominant Brand Name */}
            <div className="mb-10 fade-in-up">
              <h1 className="text-[clamp(48px,11.2vw,168px)] font-black mb-6 leading-none tracking-tighter brand-glow mono break-words">
                <span className="gradient-text">Synthector</span>
              </h1>
              <div className="h-2 w-80 mx-auto bg-gradient-to-r from-transparent via-blue-600 to-transparent glow"></div>
            </div>

            {/* Tagline (required wording) */}
            <p className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight fade-in-up stagger-1">
              Attestable privacy boundary for sensitive text before AI, analytics, storage, or workflow systems.
            </p>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed fade-in-up stagger-2">
              Synthector applies deterministic minimization, runs leak checks on anonymized output, and returns constrained evidence with the result.
            </p>

            {/* Required phrases (explicit) */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-gray-700 mono fade-in-up stagger-3 mb-12">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                <span className="font-bold">Inline text boundary.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                <span className="font-bold">Deterministic, versioned rulesets.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                <span className="font-bold">Leak checks on anonymized output.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                <span className="font-bold">Metadata-only evidence. Retention-minimized handling.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center fade-in-up stagger-4">
              <a
                href={mailto('Synthector Pilot Request')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-xl font-bold text-xl transition-all hover:scale-105 flex items-center space-x-3 shadow-2xl shadow-blue-600/30 glow"
              >
                <span>Get pilot access</span>
                <ArrowRight className="w-6 h-6" />
              </a>

              <a
                href={mailto('Synthector Technical Overview Request')}
                className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 text-gray-900 px-12 py-6 rounded-xl font-bold text-xl transition-all mono"
              >
                Request technical overview
              </a>
            </div>

            <div className="tech-line max-w-7xl mx-auto mt-14"></div>
          </div>
        </div>
      </header>

      {/* How It Works Flow */}
      <section id="how-it-works" className="py-20 px-6 relative bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 text-gray-900">
            <span className="gradient-text">How It Works</span>
          </h2>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: FileText, title: 'Input', desc: 'Sensitive text before models, storage, or workflow systems', color: 'from-red-500 to-orange-500' },
                { icon: Shield, title: 'Transform', desc: 'Apply deterministic minimization under a versioned ruleset', color: 'from-blue-600 to-blue-700' },
                { icon: Eye, title: 'Leak Gate', desc: 'Check anonymized output and fail closed on residual PII', color: 'from-indigo-600 to-indigo-700' },
                { icon: CheckCircle, title: 'Output', desc: 'Return minimized text with leak status, counts, and attestation', color: 'from-blue-500 to-cyan-600' }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="feature-card p-10 rounded-2xl border-glow scan-line h-full bg-white">
                    <div className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-8 glow`}>
                      <step.icon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 mono text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>

                  {idx < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10" aria-hidden="true">
                      <ArrowRight className="w-8 h-8 text-blue-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-14 sm:mt-16 bg-white border-2 border-blue-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl">
              <h3 className="text-4xl font-bold mb-6 mono gradient-text">Attestation</h3>
              <p className="text-gray-700 mb-10 text-xl leading-relaxed">
                Each run returns constrained evidence: timing, ruleset version, leak result, and aggregate counts.
              </p>

              <div className="bg-gray-50 p-5 sm:p-8 rounded-xl mono text-base text-gray-900 border-2 border-gray-200 shadow-sm">
                <div className="flex items-start space-x-4">
                  <Lock className="w-6 h-6 mt-1 flex-shrink-0 text-blue-600" />
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-800">Attestation receipt metadata</div>
                    <div className="text-gray-700">
                      Metadata only: identifiers, timestamps, leak result, and counts. Raw and minimized text stay out of the receipt.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="mono text-sm font-bold text-blue-600 mb-4 tracking-wide">PUBLIC SYNTHETIC LAB</p>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900">
              <span className="gradient-text">Synthector Synthetic Workflow Lab</span>
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              Select a synthetic workflow, adjust the illustrative risk profile, and compare minimized output with evidence-style metadata.
            </p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 sm:p-8 text-left text-gray-800 shadow-sm mb-10">
            <h3 className="text-2xl font-bold mono text-gray-900 mb-4">What this is not doing</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              This is an interactive synthetic demonstration. It does not process user-entered text, call a live API, or run the proprietary Synthector engine in the browser. The purpose is to show the workflow pattern: sensitive text enters an AI workflow, minimization happens before downstream processing, a leak-check outcome is produced, and evidence-style metadata is returned.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              Privacy note: the public demo records limited first-party aggregate interaction metrics to evaluate usefulness. It does not collect user-entered content, raw or minimized demo text, cookies, browser storage identifiers, full user agents, or third-party analytics identifiers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8">
            <div className="feature-card p-8 rounded-2xl border-glow bg-white">
              <h3 className="text-3xl font-bold mono text-gray-900 mb-6">Workflow selector</h3>
              <div className="space-y-3">
                {WORKFLOW_LAB_EXAMPLES.map((workflow) => {
                  const selected = workflow.id === selectedWorkflow.id

                  return (
                    <button
                      key={workflow.id}
                      type="button"
                      onClick={() => selectWorkflow(workflow.id)}
                      aria-pressed={selected}
                      className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all mono font-bold ${
                        selected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                          : 'bg-white text-gray-800 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {workflow.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="feature-card p-8 rounded-2xl border-glow bg-white">
              <h3 className="text-3xl font-bold mono text-gray-900 mb-6">Risk-category toggles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RISK_CATEGORIES.map((category) => {
                  const active = activeRiskCategories.includes(category.id)

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleRiskCategory(category.id)}
                      aria-pressed={active}
                      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                        active
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <span className="font-bold">{category.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 ${active ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}></span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 pt-6 border-t-2 border-blue-100">
                <h4 className="mono text-sm font-bold text-gray-900 mb-3">View mode</h4>
                <div className="inline-flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {[
                    { id: 'output', label: 'Minimized output' },
                    { id: 'evidence', label: 'Evidence view' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => selectDemoViewMode(mode.id)}
                      aria-pressed={demoViewMode === mode.id}
                      className={`px-5 py-3 rounded-xl border-2 mono font-bold transition-all ${
                        demoViewMode === mode.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-800 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8">
            <article className="feature-card rounded-2xl border-glow bg-white overflow-hidden">
              <div className="p-6 sm:p-8 border-b-2 border-blue-100 flex items-start justify-between gap-4">
                <div>
                  <p className="mono text-sm font-bold text-blue-600 mb-2">Selected workflow</p>
                  <h3 className="text-3xl font-bold mono text-gray-900">{selectedWorkflow.label}</h3>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-200 flex-shrink-0">
                  <FileText className="w-7 h-7 text-blue-600" />
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h4 className="mono text-sm font-bold text-gray-900 mb-3">Original synthetic text</h4>
                <p className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 text-gray-700 leading-relaxed">
                  {selectedWorkflow.original}
                </p>
              </div>
            </article>

            <article className="feature-card rounded-2xl border-glow bg-white overflow-hidden">
              <div className="p-6 sm:p-8 border-b-2 border-blue-100">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-3xl font-bold mono text-gray-900">
                    {demoViewMode === 'output' ? 'Minimized output' : 'Evidence view'}
                  </h3>
                  <div className="inline-flex items-center gap-2 bg-green-50 border-2 border-green-200 text-green-800 px-3 py-2 rounded-lg mono text-sm font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Leak-check status</span>
                  </div>
                </div>
                <p className="mt-4 text-gray-700 leading-relaxed">{selectedLeakStatus}</p>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {demoViewMode === 'output' ? (
                  <div>
                    <h4 className="mono text-sm font-bold text-gray-900 mb-3">Preview output</h4>
                    <p className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 text-gray-800 leading-relaxed">
                      {selectedOutput}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4 className="mono text-sm font-bold text-gray-900 mb-3">Illustrative receipt metadata</h4>
                    <pre className="bg-gray-950 text-blue-50 rounded-xl p-5 text-sm overflow-x-auto whitespace-pre-wrap break-words mono border-2 border-gray-800">{JSON.stringify(selectedReceipt, null, 2)}</pre>
                  </div>
                )}

                <div>
                  <h4 className="mono text-sm font-bold text-gray-900 mb-3">Detected/minimized category counts</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {RISK_CATEGORIES.map((category) => {
                      const active = activeRiskCategories.includes(category.id)

                      return (
                        <div
                          key={category.id}
                          className={`flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 mono ${
                            active ? 'bg-white border-blue-200 text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-500'
                          }`}
                        >
                          <span className="font-bold">{category.label}</span>
                          <span className="text-blue-600 font-bold">{selectedCounts[category.id]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-stretch">
            <div className="feature-card p-8 rounded-2xl border-glow bg-white">
              <h3 className="text-3xl font-bold mono text-gray-900 mb-6">Trust panel</h3>
              <ul className="space-y-4">
                {[
                  'Static synthetic workflows',
                  'No public API call',
                  'No user text collection',
                  'No browser copy of the proprietary engine',
                  'Metadata-only evidence preview'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t-2 border-blue-100">
                <p className="text-gray-700 leading-relaxed mb-5">
                  The evidence kit contains synthetic examples, illustrative receipt metadata, and a local verifier. It does not include the proprietary minimization engine.
                </p>
                <a
                  href="https://github.com/chris-run/synthector-evidence-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCurrentLabMetric('evidence_kit_clicked')}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mono transition-colors"
                >
                  <span>View the public evidence kit</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div id="sandbox-request" className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Request controlled sandbox access
              </h3>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Submit a controlled access request for synthetic or non-confidential workflow testing. Verification happens by email before manual review.
              </p>
              <SandboxRequestForm
                fallbackHref={mailto('Synthector sandbox access')}
                onSubmitAttempt={() => trackCurrentLabMetric('sandbox_request_clicked')}
                onFallbackClick={() => trackCurrentLabMetric('sandbox_request_clicked')}
              />
              <div className="mt-5 pt-5 border-t-2 border-blue-100">
                <a
                  href={mailto('Synthector 20-minute Technical-Fit Call Request')}
                  onClick={() => trackCurrentLabMetric('technical_call_clicked')}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mono transition-colors"
                >
                  <span>Request a 20-minute technical-fit call</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-8 text-gray-900">
            Current <span className="gradient-text">product surface</span>
          </h2>
          <p className="text-center text-gray-600 text-xl mb-16 max-w-3xl mx-auto leading-relaxed">
            Synthector minimizes sensitive text, checks the result for residual leakage, and returns constrained evidence for review.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Deterministic Minimization',
                desc: 'Stable outputs under a versioned ruleset.',
                icon: Zap,
                features: ['Versioned rulesets', 'Repeatable outputs', 'Predictable enforcement']
              },
              {
                title: 'Leak Checks',
                desc: 'Second-pass checks on anonymized output with fail-closed support.',
                icon: Shield,
                features: ['Anonymized-output checks', 'Fail-closed support', 'Categorical results']
              },
              {
                title: 'Retention-Minimized Handling',
                desc: 'Raw text is processed transiently; minimized text is returned rather than intentionally persisted on the sync path.',
                icon: Database,
                features: ['Transient raw-text handling', 'Minimized text returned', 'Metadata-only evidence']
              }
            ].map((feature, idx) => (
              <div key={idx} className="feature-card p-12 rounded-2xl border-glow group bg-white">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform glow">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-5 mono text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-10 leading-relaxed text-lg">{feature.desc}</p>
                <ul className="space-y-4">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center space-x-4 text-base text-gray-700">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security / Architecture Section */}
      <section id="security" className="py-20 px-6 grid-bg">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-10 text-center text-gray-900">
              <span className="gradient-text">Handling posture</span>
            </h2>
            <p className="text-gray-700 mb-12 text-xl leading-relaxed text-center max-w-3xl mx-auto">
              <span className="font-semibold">Sync text handling is retention-minimized. </span>
              Raw text is processed transiently, minimized text is returned to the caller, and retained state is limited to metadata, metering, aggregates, and logs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card p-10 rounded-2xl border-glow bg-white">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 border-2 border-blue-200">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 mono">Transient Sync Processing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Raw text is handled in memory for the request.
                </p>
              </div>

              <div className="feature-card p-10 rounded-2xl border-glow bg-white">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 border-2 border-blue-200">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 mono">Metadata-Only Evidence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Evidence is limited to metadata, leak results, and aggregate counts.
                </p>
              </div>

              <div className="feature-card p-10 rounded-2xl border-glow bg-white">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 border-2 border-blue-200">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 mono">Focused by Design</h3>
                <p className="text-gray-600 leading-relaxed">
                  Synthector is focused on sensitive text. Broader workflows and additional modules can be layered around that core.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-t-2 border-b-2 border-blue-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-10 leading-tight text-gray-900">
            Get <span className="gradient-text">pilot access</span>
          </h2>
          <p className="text-2xl text-gray-700 mb-12 leading-relaxed">
            Email works best. Include the text source, target system, volume, and any retention or review constraints.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href={mailto('Synthector Pilot Request')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-xl font-bold text-xl transition-all hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl shadow-blue-600/30 glow"
            >
              <span>Get pilot access</span>
              <ArrowRight className="w-7 h-7" />
            </a>
            <a
              href={mailto('Synthector Demo Request')}
              className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 text-gray-900 px-12 py-6 rounded-xl font-bold text-xl transition-all mono"
            >
              Schedule demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t-2 border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="max-w-md">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center glow">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold mono tracking-tight text-gray-900">SYNTHECTOR</span>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Deterministic minimization for sensitive text.
              </p>
              <p className="text-gray-700 font-semibold">
                Contact:{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 mono text-gray-900 text-lg">Resources</h3>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#features" className="hover:text-blue-600 transition-colors text-lg">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors text-lg">How It Works</a></li>
                <li><a href="#demo" className="hover:text-blue-600 transition-colors text-lg">Demo</a></li>
                <li><a href="#security" className="hover:text-blue-600 transition-colors text-lg">Security</a></li>
                <li><a href="/privacy.html" className="hover:text-blue-600 transition-colors text-lg">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="tech-line mb-8"></div>

          <div className="flex flex-col md:flex-row justify-between items-center text-gray-600">
            <p className="text-lg">© 2026 Synthector. All rights reserved.</p>
            <p className="mono mt-4 md:mt-0">Deterministic minimization for sensitive text.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
