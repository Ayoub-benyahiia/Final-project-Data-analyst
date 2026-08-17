import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { SocialProof } from '../components/landing/SocialProof';
import { Features } from '../components/landing/Features';
import { Personas } from '../components/landing/Personas';
import { DarkCTA } from '../components/landing/DarkCTA';
import { FAQ } from '../components/landing/FAQ';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white font-sans">
      {/* 1. Fixed Top Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section with Search and 3D Floating Mockups */}
        <HeroSection />

        {/* 3. Company Logos Social Proof */}
        <SocialProof />

        {/* 4. Features with In-Depth Dashboard Mockup */}
        <Features />

        {/* 5. 3 Target Personas Cards */}
        <Personas />

        {/* 6. High-Contrast Dark CTA Section */}
        <DarkCTA />

        {/* 7. Accordion FAQ Section */}
        <FAQ />

        {/* 8. Bottom Final CTA */}
        <FinalCTA />
      </main>

      {/* 9. Multi-Column Footer */}
      <Footer />
    </div>
  );
}
