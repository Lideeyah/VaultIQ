import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Link as LinkIcon, Globe, Zap, CheckCircle, ArrowRight, Users, TrendingUp, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Verification',
      description: 'Advanced AI models verify asset documentation and visual proofs with 99.9% accuracy',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Chainlink Proof of Reserve',
      description: 'Cryptographic proof that your tokenized assets are backed by real-world value',
      color: 'blue'
    },
    {
      icon: LinkIcon,
      title: 'Cross-Chain Bridging',
      description: 'Move your tokenized assets across multiple blockchains using Chainlink CCIP',
      color: 'green'
    },
    {
      icon: Zap,
      title: 'Real-Time Pricing',
      description: 'Dynamic asset valuation powered by Chainlink Data Feeds and market oracles',
      color: 'yellow'
    }
  ];

  const stats = [
    { label: 'Assets Tokenized', value: '$2.4B+', icon: TrendingUp },
    { label: 'AI Verifications', value: '150K+', icon: Brain },
    { label: 'Cross-Chain Transfers', value: '45K+', icon: LinkIcon },
    { label: 'Success Rate', value: '99.9%', icon: Award }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Real Estate Investor',
      content: 'VaultIQ  made tokenizing my property portfolio incredibly simple. The AI verification gave me confidence in the process.',
      avatar: '👩‍💼'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Art Collector',
      content: 'The cross-chain capabilities are game-changing. I can now trade my tokenized art across multiple platforms.',
      avatar: '👨‍🎨'
    },
    {
      name: 'David Kim',
      role: 'Equipment Dealer',
      content: 'Proof of Reserve integration ensures my clients trust the tokenization process. Brilliant platform.',
      avatar: '👨‍💻'
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6 animate-fade-in">
              <Globe className="h-4 w-4 mr-2" />
              Powered by Chainlink & ElizaOS
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 animate-slide-up">
              AI-Verified
              <br />
              Tokenized Assets
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 animate-slide-up-delay">
              Transform real-world assets into secure, verifiable digital tokens with AI-powered validation and cross-chain capabilities
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up-delay-2">
            <Link
              to="/create"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Tokenizing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-200 shadow-lg"
            >
              View Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-3 group-hover:bg-white/20 transition-colors">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Next-Generation Asset Tokenization
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining AI verification, blockchain security, and cross-chain interoperability for the future of asset ownership
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="mb-6">
                  <div className={`inline-flex p-3 bg-gradient-to-r from-${feature.color}-100 to-${feature.color}-200 rounded-xl`}>
                    <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple three-step process to tokenize your real-world assets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Upload & Verify',
                description: 'Upload your asset documentation and photos. Our AI verifies authenticity and generates risk scores.',
                icon: Brain
              },
              {
                step: '02',
                title: 'Mint Vault Token',
                description: 'Create a unique NFT representing your verified asset with Chainlink Proof of Reserve backing.',
                icon: Shield
              },
              {
                step: '03',
                title: 'Bridge & Trade',
                description: 'Move your tokens across chains using CCIP and trade on multiple DeFi platforms.',
                icon: LinkIcon
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  <div className="inline-flex p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                    <step.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Asset Owners Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users say about their tokenization experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{testimonial.avatar}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Tokenize Your Assets?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust VaultIQ  for secure, AI-verified asset tokenization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Start Your First Vault
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/20"
            >
              Explore Platform
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;