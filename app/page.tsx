'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#D48C3D" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                <span className="text-[#D48C3D]">Ultra-Fast</span> RWA Lending on <span className="text-[#D48C3D]">Specialized Rollup</span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-lg">
                Borrow and lend against real-world assets with near-instant finality, powered by Espresso confirmations on our custom DeFi rollup.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/borrow" 
                  className="px-8 py-3 bg-[#D48C3D] text-[#121212] font-semibold rounded-lg transition-all duration-200 hover:bg-[#9B4D1F] hover:shadow-lg hover:-translate-y-1 text-center"
                >
                  Borrow Now
                </Link>
                <Link 
                  href="/lend" 
                  className="px-8 py-3 bg-[#1A1A1A] border border-[#D48C3D] text-[#D48C3D] font-semibold rounded-lg transition-all duration-200 hover:bg-[#252525] hover:shadow-lg hover:-translate-y-1 text-center"
                >
                  Start Lending
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                <Image
                  src="/espresso-logo.png"
                  alt="Espresso RWA"
                  fill
                  className="object-contain w-[450px] h-[450px] md:w-[600px] md:h-[600px] lg:w-[900px] lg:h-[900px] scale-120"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How <span className="text-[#D48C3D]">Espresso RWA</span> Works
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our specialized DeFi rollup leverages Espresso confirmations to provide ultra-fast transactions for real-world asset lending.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="espresso-card p-6">
              <div className="w-12 h-12 bg-[#D48C3D] rounded-lg mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-[#121212]">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Specialized Rollup</h3>
              <p className="text-gray-400">
                Our custom rollup is purpose-built for DeFi, optimizing for settlement speed and security for real-world assets.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="espresso-card p-6">
              <div className="w-12 h-12 bg-[#D48C3D] rounded-lg mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-[#121212]">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Espresso Confirmations</h3>
              <p className="text-gray-400">
                BFT consensus with Espresso confirmations provides near-instant finality across our entire lending platform.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="espresso-card p-6">
              <div className="w-12 h-12 bg-[#D48C3D] rounded-lg mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-[#121212]">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">RWA Tokenization</h3>
              <p className="text-gray-400">
                Our platform supports a wide range of tokenized real-world assets, from real estate to commodities and invoice factoring.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* RWA Asset Types Section */}

      
      {/* How It Works Section */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">How Our DeFi Rollup Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col">
              <div className="rounded-lg bg-[#121212] border border-[#303030] p-6 mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#D48C3D] flex items-center justify-center text-[#121212] font-bold text-lg mr-4">1</div>
                  <h3 className="text-xl font-bold text-white">Custom Settlement Layer</h3>
                </div>
                <p className="text-gray-400">
                  Our specialized DeFi rollup is optimized for fast settlement of complex RWA transactions, with custom data availability and execution environment.
                </p>
              </div>
              
              <div className="rounded-lg bg-[#121212] border border-[#303030] p-6 mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#D48C3D] flex items-center justify-center text-[#121212] font-bold text-lg mr-4">2</div>
                  <h3 className="text-xl font-bold text-white">Espresso Confirmations</h3>
                </div>
                <p className="text-gray-400">
                  Transactions are confirmed by Espresso Network's Byzantine Fault Tolerant consensus, providing near-instant finality and security.
                </p>
              </div>
              
              <div className="rounded-lg bg-[#121212] border border-[#303030] p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#D48C3D] flex items-center justify-center text-[#121212] font-bold text-lg mr-4">3</div>
                  <h3 className="text-xl font-bold text-white">Cross-Chain Composability</h3>
                </div>
                <p className="text-gray-400">
                  Assets can flow seamlessly between our rollup and other chains, with operations that work together as one unified system.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="rounded-lg bg-[#121212] border border-[#303030] p-6 mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#D48C3D] flex items-center justify-center text-[#121212] font-bold text-lg mr-4">4</div>
                  <h3 className="text-xl font-bold text-white">RWA Tokenization Layer</h3>
                </div>
                <p className="text-gray-400">
                  Legal and compliance frameworks are built directly into the protocol, ensuring all RWA tokens have proper off-chain legal backing.
                </p>
              </div>
              
              <div className="rounded-lg bg-[#121212] border border-[#303030] p-6 mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#D48C3D] flex items-center justify-center text-[#121212] font-bold text-lg mr-4">5</div>
                  <h3 className="text-xl font-bold text-white">Smart Lending Pools</h3>
                </div>
                <p className="text-gray-400">
                  Our automated lending pools use advanced risk assessment algorithms to optimize rates based on collateral quality and market conditions.
                </p>
              </div>
              
              <div className="rounded-lg bg-[#121212] border border-[#303030] p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#D48C3D] flex items-center justify-center text-[#121212] font-bold text-lg mr-4">6</div>
                  <h3 className="text-xl font-bold text-white">Automated Compliance</h3>
                </div>
                <p className="text-gray-400">
                  Built-in compliance checks and automated reporting ensure all lending activities meet regulatory requirements across jurisdictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      
      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="espresso-card p-6 text-center">
              <h4 className="text-4xl md:text-5xl font-bold text-[#D48C3D] mb-2">1.2s</h4>
              <p className="text-gray-300">Average Settlement Time</p>
            </div>
            {/* <div className="espresso-card p-6 text-center">
              <h4 className="text-4xl md:text-5xl font-bold text-[#D48C3D] mb-2">$47M+</h4>
              <p className="text-gray-300">Total RWA Value Locked</p>
            </div>
            <div className="espresso-card p-6 text-center">
              <h4 className="text-4xl md:text-5xl font-bold text-[#D48C3D] mb-2">6.8%</h4>
              <p className="text-gray-300">Average Lender APY</p>
            </div>
            <div className="espresso-card p-6 text-center">
              <h4 className="text-4xl md:text-5xl font-bold text-[#D48C3D] mb-2">4</h4>
              <p className="text-gray-300">RWA Asset Classes</p>
            </div> */}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#121212] to-[#1A1A1A]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to access <span className="text-[#D48C3D]">ultra-fast RWA lending</span>?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get started with our specialized DeFi rollup and experience the future of real-world asset finance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* <Link 
              href="/borrow" 
              className="px-8 py-3 bg-[#D48C3D] text-[#121212] font-semibold rounded-lg transition-all duration-200 hover:bg-[#9B4D1F] hover:shadow-lg hover:-translate-y-1"
            >
              Browse RWA Assets
            </Link> */}
            <Link 
              href="/lend" 
              className="px-8 py-3 bg-[#4B40DA] text-white font-semibold rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-1"
            >
              Start Lending
            </Link>
            {/* <Link 
              href="/my-loans" 
              className="px-8 py-3 bg-[#1A1A1A] border border-[#303030] text-white font-semibold rounded-lg transition-all duration-200 hover:bg-[#252525] hover:border-[#D48C3D] hover:shadow-lg hover:-translate-y-1"
            >
              Read Documentation
            </Link> */}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#121212] border-t border-[#303030] py-12 px-4 sm:px-6 lg:px-8">
        {/* <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="relative h-10 w-10 mr-2">
                <Image
                  src="/espresso-logo.png"
                  alt="Espresso RWA Logo"
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              </div>
              <div>
                <span className="text-[#D48C3D] text-xl font-bold">Espresso</span>
                <span className="text-white text-xl font-bold ml-1">RWA</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 md:mb-0">
              <div>
                <h3 className="text-[#D48C3D] font-semibold mb-3">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Rollup Technology</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">RWA Whitelisting</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[#D48C3D] font-semibold mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Research</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Rate Oracle</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[#D48C3D] font-semibold mb-3">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[#D48C3D] font-semibold mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Compliance</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#303030] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2024 Espresso RWA. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#D48C3D]">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D48C3D]">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D48C3D]">
                <span className="sr-only">Discord</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>
        </div> */}
      </footer>
    </main>
  );
}
