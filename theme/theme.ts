import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorInfo: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    fontSize: 16,
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Button: {
      borderRadius: 24,
      fontSize: 16,
      paddingInline: 24,
      paddingBlock: 8,
      boxShadow: 'none',
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      colorBorderSecondary: '#f0f0f0',
    },
    Typography: {
      fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    },
    Layout: {
      headerBg: '#ffffff',
      headerPadding: '0 24px',
      headerHeight: 64,
    },
    Menu: {
      fontSize: 16,
      itemHoverBg: 'transparent',
      itemSelectedBg: 'transparent',
      itemSelectedColor: '#1890ff',
      itemActiveBg: 'transparent',
      itemHoverColor: '#40a9ff',
    },
  },
};

export default theme;
