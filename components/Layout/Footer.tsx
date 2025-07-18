import styled from '@emotion/styled';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const StyledFooter = styled(AntFooter)`
  text-align: center;
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
  padding: 24px 50px;
  margin-top: auto;
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <StyledFooter>
      AI Projects ©{currentYear} Created by You
    </StyledFooter>
  );
}
