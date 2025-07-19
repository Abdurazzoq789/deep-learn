'use client';

import dynamic from 'next/dynamic';

// Layout usually doesn't need ssr: false unless it uses browser APIs
import Layout from '@/components/Layout';

const Hero = dynamic(() => import('@/components/Home/Hero'));
const AboutSection = dynamic(() => import('@/components/About/AboutSection'));
const TeamSection = dynamic(() => import('@/components/Team/TeamSection'));
const TargetAudienceSection = dynamic(() => import('@/components/TargetAudience/TargetAudienceSection'));
const ProjectsSection = dynamic(() => import('@/components/Projects/ProjectsSection'));
const ContactSection = dynamic(() => import('@/components/Contact/ContactSection'));

export default function Home() {
  return (
    <Layout>
      <Hero />
      <AboutSection />
      <TargetAudienceSection />
      <ProjectsSection />
      <ContactSection />
      <TeamSection />
    </Layout>
  );
}
