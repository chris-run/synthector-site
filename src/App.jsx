import React, { useEffect, useState } from 'react'
import { Shield, Lock, CheckCircle, ArrowRight, Zap, FileText, Eye, Database } from 'lucide-react'

const CONTACT_EMAIL = 'contact@synthector.com'

const DEMO_EXAMPLES = [
  {
    title: 'Contact-center transcript',
    original:
      'Agent: Thanks for calling Northstar Energy. Caller Maya Chen says account MC-44219 needs a callback at (415) 555-0184 and email follow-up at maya.chen@example.test. She asks to update service address to 118 Harbor Lane, Apt 4, Redwood City, CA 94063.',
    minimized:
      'Agent: Thanks for calling Northstar Energy. Caller [PERSON_1] says account [ACCOUNT_ID_1] needs a callback at [PHONE_1] and email follow-up at [EMAIL_1]. She asks to update service address to [ADDRESS_1].',
    leakStatus: 'Demo pass: minimized output contains placeholders only.',
    counts: {
      person: 1,
      account_id: 1,
      phone: 1,
      email: 1,
      address: 1
    }
  },
  {
    title: 'CRM support note',
    original:
      'Follow up with Jordan Reed from Acme Cloud Trial on ticket CRM-7782. Last four of payment card 4242 should not be copied into analytics. Preferred email is jordan.reed@example.test, and the renewal quote is Q-20491.',
    minimized:
      'Follow up with [PERSON_1] from [ORGANIZATION_1] on ticket [SUPPORT_ID_1]. [PAYMENT_HINT_1] should not be copied into analytics. Preferred email is [EMAIL_1], and the renewal quote is [QUOTE_ID_1].',
    leakStatus: 'Demo pass: no original synthetic identifiers shown in output.',
    counts: {
      person: 1,
      organization: 1,
      support_id: 1,
      payment_hint: 1,
      email: 1,
      quote_id: 1
    }
  },
  {
    title: 'HR/internal operational note',
    original:
      'Manager note: Priya N. requested time away for a medical appointment on June 14. Employee ID E-10488 is assigned to the case, and team lead Sam Ortiz will cover payroll approval.',
    minimized:
      'Manager note: [EMPLOYEE_1] requested time away for [SENSITIVE_REASON_1] on [DATE_1]. Employee ID [EMPLOYEE_ID_1] is assigned to the case, and team lead [PERSON_2] will cover payroll approval.',
    leakStatus: 'Demo pass: sensitive context is minimized to category labels.',
    counts: {
      employee: 1,
      sensitive_reason: 1,
      date: 1,
      employee_id: 1,
      person: 1
    }
  },
  {
    title: 'Legal/compliance-style note',
    original:
      'Draft memo: case contact Elena Park at elena.park@example.test referenced subpoena matter LGL-3320 and bank account ending 9012. Counsel callback is (212) 555-0147.',
    minimized:
      'Draft memo: case contact [PERSON_1] at [EMAIL_1] referenced subpoena matter [MATTER_ID_1] and [FINANCIAL_ACCOUNT_HINT_1]. Counsel callback is [PHONE_1].',
    leakStatus: 'Demo pass: receipt preview contains metadata only.',
    counts: {
      person: 1,
      email: 1,
      matter_id: 1,
      financial_account_hint: 1,
      phone: 1
    }
  }
]

function totalCount(counts) {
  return Object.values(counts).reduce((sum, count) => sum + count, 0)
}

function receiptPreview(example) {
  return {
    ruleset_version: 'demo-static-v0',
    leak_status: 'pass',
    entities_total: totalCount(example.counts),
    entities_by_type: example.counts,
    attestation_mode: 'illustrative_demo'
  }
}

function mailto(subject) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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

      {/* Static Demo Section */}
      <section id="demo" className="py-20 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="mono text-sm font-bold text-blue-600 mb-4 tracking-wide">PUBLIC STATIC DEMO</p>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900">
              <span className="gradient-text">Synthector AI Privacy Boundary Demo</span>
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Explore four static synthetic examples showing the intended boundary shape: original synthetic text, minimized output, leak-check status, aggregate counts, and illustrative receipt metadata.
            </p>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-left text-gray-800 shadow-sm">
              <p className="font-bold mb-3">
                This is a static synthetic demo. It shows representative inputs, minimized outputs, leak-check status, and illustrative evidence metadata. It does not accept user-entered text or call a live API.
              </p>
              <p className="text-gray-700">
                Custom workflow testing is available through a controlled technical-fit call.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {DEMO_EXAMPLES.map((example) => (
              <article key={example.title} className="feature-card rounded-2xl border-glow bg-white overflow-hidden">
                <div className="p-6 sm:p-8 border-b-2 border-blue-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold mono text-gray-900 mb-3">{example.title}</h3>
                      <div className="inline-flex items-center gap-2 bg-green-50 border-2 border-green-200 text-green-800 px-3 py-2 rounded-lg mono text-sm font-bold">
                        <CheckCircle className="w-4 h-4" />
                        <span>Leak-check status</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-200 flex-shrink-0">
                      <FileText className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700 leading-relaxed">{example.leakStatus}</p>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h4 className="mono text-sm font-bold text-gray-900 mb-3">Original synthetic text</h4>
                    <p className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-gray-700 leading-relaxed">
                      {example.original}
                    </p>
                  </div>

                  <div>
                    <h4 className="mono text-sm font-bold text-gray-900 mb-3">Minimized/redacted output</h4>
                    <p className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-gray-800 leading-relaxed">
                      {example.minimized}
                    </p>
                  </div>

                  <div>
                    <h4 className="mono text-sm font-bold text-gray-900 mb-3">Detected/minimized category counts</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(example.counts).map(([category, count]) => (
                        <span key={category} className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg px-3 py-2 mono text-sm text-gray-800">
                          <span className="font-bold">{category}</span>
                          <span className="text-blue-600 font-bold">{count}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mono text-sm font-bold text-gray-900 mb-3">Attestation-style receipt preview</h4>
                    <pre className="bg-gray-950 text-blue-50 rounded-xl p-4 text-sm overflow-x-auto whitespace-pre-wrap break-words mono border-2 border-gray-800">{JSON.stringify(receiptPreview(example), null, 2)}</pre>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-stretch">
            <div className="feature-card p-8 rounded-2xl border-glow bg-white">
              <h3 className="text-3xl font-bold mono text-gray-900 mb-6">Trust panel</h3>
              <ul className="space-y-4">
                {[
                  'Static synthetic demo',
                  'No public API call',
                  'No user text collection',
                  'No LLM dependency in the core redaction thesis',
                  'Metadata-only evidence preview'
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span className="font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-8 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Controlled workflow testing
              </h3>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                Use email for controlled workflow testing, fit review, and safe sample-handling discussion.
              </p>
              <a
                href={mailto('Synthector 20-minute Technical-Fit Call Request')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-xl font-bold text-base sm:text-lg leading-snug transition-all hover:scale-105 inline-flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 glow w-full sm:w-fit text-left sm:text-center"
              >
                <span>Testing AI workflows with sensitive text? Request a 20-minute technical-fit call.</span>
                <ArrowRight className="w-6 h-6" />
              </a>
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
