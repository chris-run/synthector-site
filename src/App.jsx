import React, { useEffect, useState } from 'react'
import { Shield, Lock, CheckCircle, ArrowRight, Zap, FileText, Eye, Database } from 'lucide-react'

const CONTACT_EMAIL = 'Synthector@gmail.com'

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
            <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
          </div>

          <a
            href={mailto('Synthector Pilot Request')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all hover:scale-105 mono text-sm shadow-lg shadow-blue-600/30 whitespace-nowrap"
          >
            Request pilot
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="top" className="relative pt-32 pb-28 px-6 grid-bg overflow-hidden">
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Dominant Brand Name */}
            <div className="mb-16 fade-in-up">
              <h1 className="text-[clamp(56px,14vw,210px)] font-black mb-6 leading-none tracking-tighter brand-glow mono break-words">
                <span className="gradient-text">Synthector</span>
              </h1>
              <div className="h-2 w-80 mx-auto bg-gradient-to-r from-transparent via-blue-600 to-transparent glow"></div>
            </div>

            {/* Tagline (required wording) */}
            <p className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight fade-in-up stagger-1">
              Deterministic privacy redaction + leak-gate for AI ingestion.
            </p>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed fade-in-up stagger-2">
              Embed into transcript/data pipelines to reduce content exposure and support audits.
              <span className="font-semibold"> Designed for regulated pipelines.</span>
            </p>

            {/* Required phrases (explicit) */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-gray-700 mono fade-in-up stagger-3 mb-12">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                <span className="font-bold">Zero retention by default.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                <span className="font-bold">Posthoc leak check runs on anonymized output only.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                <span className="font-bold">Deterministic, audit-friendly, tenant-isolated.</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                <span className="font-bold">Designed for regulated pipelines.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center fade-in-up stagger-4">
              <a
                href={mailto('Synthector Pilot Request')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-xl font-bold text-xl transition-all hover:scale-105 flex items-center space-x-3 shadow-2xl shadow-blue-600/30 glow"
              >
                <span>Request pilot access</span>
                <ArrowRight className="w-6 h-6" />
              </a>

              <a
                href={mailto('Synthector Technical Overview Request')}
                className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 text-gray-900 px-12 py-6 rounded-xl font-bold text-xl transition-all mono"
              >
                Request technical overview
              </a>
            </div>

            <div className="tech-line max-w-7xl mx-auto mt-28"></div>
          </div>
        </div>
      </header>

      {/* How It Works Flow */}
      <section id="how-it-works" className="py-28 px-6 relative bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-24 text-gray-900">
            <span className="gradient-text">How It Works</span>
          </h2>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: FileText, title: 'Input', desc: 'Transcripts and documents containing sensitive content', color: 'from-red-500 to-orange-500' },
                { icon: Shield, title: 'Transform', desc: 'Deterministic redaction under policy', color: 'from-blue-600 to-blue-700' },
                { icon: Eye, title: 'Leak Gate', desc: 'Verification step; fail-closed optional', color: 'from-indigo-600 to-indigo-700' },
                { icon: CheckCircle, title: 'Output', desc: 'Redacted output + evidence metadata', color: 'from-blue-500 to-cyan-600' }
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

            <div className="mt-16 sm:mt-24 bg-white border-2 border-blue-200 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-xl">
              <h3 className="text-4xl font-bold mb-6 mono gradient-text">Attestation</h3>
              <p className="text-gray-700 mb-10 text-xl leading-relaxed">
                Proof artifacts are outcome-level: designed to support audits and partner verification with cryptographic signing.
              </p>

              <div className="bg-gray-50 p-5 sm:p-8 rounded-xl mono text-base text-gray-900 border-2 border-gray-200 shadow-sm">
                <div className="flex items-start space-x-4">
                  <Lock className="w-6 h-6 mt-1 flex-shrink-0 text-blue-600" />
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-800">Signed attestation token (JWS) available</div>
                    <div className="text-gray-700">
                      Evidence: metadata only (policy/ruleset identity + gate outcome). No content artifacts stored.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-28 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-8 text-gray-900">
            Built for <span className="gradient-text">regulated scale</span>
          </h2>
          <p className="text-center text-gray-600 text-xl mb-24 max-w-3xl mx-auto leading-relaxed">
            API-first redaction for call centers, transcription platforms, and AI ingestion paths that cannot compromise on privacy posture.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Deterministic Redaction',
                desc: 'Repeatable transforms under a stable policy. Supports reproducibility and predictable enforcement.',
                icon: Zap,
                features: ['Repeatable outputs', 'Audit-friendly evidence', 'Change-controlled policies']
              },
              {
                title: 'Posthoc Leak Gate',
                desc: 'Verification step designed to block suspicious residuals. Posthoc leak check runs on anonymized output only.',
                icon: Shield,
                features: ['Outcome verification', 'Fail-closed configurable', 'Partner-safe evidence']
              },
              {
                title: 'Zero Retention Posture',
                desc: 'Zero retention by default. Process in-memory and return outputs without persisting raw or redacted content artifacts.',
                icon: Database,
                features: ['In-memory processing', 'No content artifacts stored', 'Aggregate-only telemetry modes (optional)']
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
      <section id="security" className="py-28 px-6 grid-bg">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-10 text-center text-gray-900">
              <span className="gradient-text">Security posture</span>
            </h2>
            <p className="text-gray-700 mb-16 text-xl leading-relaxed text-center max-w-3xl mx-auto">
              <span className="font-semibold">Synthector processes content in-memory and does not retain customer content artifacts.</span>
              Built to support regulated ingestion paths with explicit control semantics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card p-10 rounded-2xl border-glow bg-white">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 border-2 border-blue-200">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 mono">Ephemeral Processing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Requests are processed in-memory and not persisted as raw or redacted artifacts.
                </p>
              </div>

              <div className="feature-card p-10 rounded-2xl border-glow bg-white">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 border-2 border-blue-200">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 mono">Attestation Evidence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Outcome-level metadata and optional signed attestation (JWS) for verification and audits.
                </p>
              </div>

              <div className="feature-card p-10 rounded-2xl border-glow bg-white">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 border-2 border-blue-200">
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 mono">Audit-friendly by design</h3>
                <p className="text-gray-600 leading-relaxed">
                  Deterministic, tenant-isolated operation with evidence metadata designed to support compliance workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-t-2 border-b-2 border-blue-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-10 leading-tight text-gray-900">
            Request <span className="gradient-text">pilot access</span>
          </h2>
          <p className="text-2xl text-gray-700 mb-12 leading-relaxed">
            Email works best for the pilot. Include what system you’re integrating with and your constraints (retention, region, volume).
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href={mailto('Synthector Pilot Request')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-xl font-bold text-xl transition-all hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl shadow-blue-600/30 glow"
            >
              <span>Request pilot access</span>
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
      <footer className="py-20 px-6 border-t-2 border-gray-200 bg-white">
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
                Deterministic privacy redaction + leak-gate for AI ingestion.
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
                <li><a href="#security" className="hover:text-blue-600 transition-colors text-lg">Security</a></li>
                <li><a href="/privacy.html" className="hover:text-blue-600 transition-colors text-lg">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="tech-line mb-8"></div>

          <div className="flex flex-col md:flex-row justify-between items-center text-gray-600">
            <p className="text-lg">© 2026 Christopher R. Runowski. All rights reserved.</p>
            <p className="mono mt-4 md:mt-0">Built for privacy. Verified by design.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
