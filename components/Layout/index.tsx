import { Layout as AntLayout } from 'antd';
import styled from '@emotion/styled';
import Head from 'next/head';
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

const { Content } = AntLayout;

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
  background: #f0f2f5;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
`;

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function Layout({ children, title = 'AI Projects' }: LayoutProps) {
  return (
    <StyledLayout>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Showcase of AI projects" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <StyledContent>{children}</StyledContent>
      <Footer />
    </StyledLayout>
  );
}
