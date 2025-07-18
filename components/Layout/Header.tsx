import { Menu } from 'antd';
import Link from 'next/link';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const StyledHeader = styled.header`
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  position: sticky;
  top: 0;
  z-index: 1;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1890ff;
  padding: 16px 0;
`;

const Nav = styled.nav`
  .ant-menu {
    border-bottom: none;
  }
`;

// Add this type guard to check if router is available
const useSafeRouter = () => {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRouter();
  } catch (e) {
    // Return a mock router when not available
    return { pathname: '/' };
  }
};

export default function Header() {
  const router = useSafeRouter();
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState('');

  // Set initial state in useEffect to ensure it runs only on the client
  useEffect(() => {
    setMounted(true);
    // Safely get pathname with fallback
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    setCurrent(path === '/' ? 'home' : path.substring(1).split('/')[0]);
  }, [router.pathname]);

  // Define menu items statically to avoid dependency on router
  const menuItems = [
    { label: <Link href="/">Home</Link>, key: 'home' },
    { label: <Link href="/projects">Projects</Link>, key: 'projects' },
    { label: <Link href="/about">About</Link>, key: 'about' },
    { label: <Link href="/contact">Contact</Link>, key: 'contact' },
  ];

  // Only render the menu when component is mounted on the client
  if (!mounted) {
    return (
      <StyledHeader>
        <Container>
          <Link href="/" passHref>
            <Logo>AI Projects</Logo>
          </Link>
        </Container>
      </StyledHeader>
    );
  }

  return (
    <StyledHeader>
      <Container>
        <Link href="/" passHref>
          <Logo>AI Projects</Logo>
        </Link>
        <Nav>
          <Menu
            onClick={(e) => setCurrent(e.key)}
            selectedKeys={[current]}
            mode="horizontal"
            items={menuItems}
            style={{ border: 'none', lineHeight: '64px' }}
          />
        </Nav>
      </Container>
    </StyledHeader>
  );
}
