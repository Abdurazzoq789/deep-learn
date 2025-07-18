'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import theme from '@/theme/theme';
import { ReactNode, useState } from 'react';
import { Global, css } from '@emotion/react';

const globalStyles = css`
  :root {
    --primary-color: #1890ff;
    --secondary-color: #36cfc9;
    --text-color: #2c3e50;
    --text-secondary: #666;
    --border-color: #f0f0f0;
    --background-light: #f9f9f9;
    --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    --transition: all 0.3s ease;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: var(--text-color);
    background-color: #fff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: var(--transition);

    &:hover {
      color: #40a9ff;
    }
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .ant-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 500;
    transition: var(--transition);

    &-primary {
      box-shadow: 0 2px 0 rgba(5, 145, 255, 0.1);

      &:hover, &:focus {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
      }
    }
  }
`;

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <ConfigProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Global styles={globalStyles} />
        {children}
      </QueryClientProvider>
    </ConfigProvider>
  );
}
