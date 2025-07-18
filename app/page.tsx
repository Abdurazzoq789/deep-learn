'use client';

import dynamic from 'next/dynamic';

// Layout usually doesn't need ssr: false unless it uses browser APIs
import Layout from '@/components/Layout';

const Hero = dynamic(() => import('@/components/Home/Hero'));
const FeaturesSection = dynamic(() => import('@/components/Features/FeaturesSection'));
const ProjectsSection = dynamic(() => import('@/components/Projects/ProjectsSection'));
const ContactSection = dynamic(() => import('@/components/Contact/ContactSection'));

export default function Home() {
  return (
    <Layout>
      <Hero />
      <FeaturesSection />
      <ProjectsSection />
      <ContactSection />
    </Layout>
  );
}
