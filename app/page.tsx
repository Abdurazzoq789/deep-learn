'use client';

import dynamic from 'next/dynamic';

// Layout usually doesn't need ssr: false unless it uses browser APIs
import Layout from '@/components/Layout';

const Hero = dynamic(() => import('@/components/Home/Hero'));
const AboutSection = dynamic(() => import('@/components/About/AboutSection'));
const FeaturesSection = dynamic(() => import('@/components/Features/FeaturesSection'));
const TeamSection = dynamic(() => import('@/components/Team/TeamSection'));
const TargetAudienceSection = dynamic(() => import('@/components/TargetAudience/TargetAudienceSection'));
const MonetizationModelSection = dynamic(() => import('@/components/Monetization/MonetizationModelSection'));
const BusinessModelSection = dynamic(() => import('@/components/BusinessModel/BusinessModelSection'));
const MilestonesSection = dynamic(() => import('@/components/Milestones/MilestonesSection'));
const ProjectsSection = dynamic(() => import('@/components/Projects/ProjectsSection'));
const ContactSection = dynamic(() => import('@/components/Contact/ContactSection'));

export default function Home() {
  return (
    <Layout>
      <Hero />
      <AboutSection />
      <FeaturesSection />
      <TeamSection />
      <TargetAudienceSection />
      <MonetizationModelSection />
      <BusinessModelSection />
      <MilestonesSection />
      <ProjectsSection />
      <ContactSection />
    </Layout>
  );
}
