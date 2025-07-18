'use client';

import { Typography, Row, Col, Card } from 'antd';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { UsergroupAddOutlined, SolutionOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SectionContainer = styled.section`
  padding: 80px 0;
  background: linear-gradient(180deg, #f9fbfd 0%, #ffffff 100%);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 0 24px;
`;

const SectionTitle = styled(Title)`
  font-size: 2.8rem !important;
  margin-bottom: 60px !important;
  animation: ${fadeIn} 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.2s;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #1890ff 0%, #36cfc9 100%);
    border-radius: 2px;
  }
`;

const AudienceCard = styled(Card)`
  height: 100%;
  border-radius: 16px;
  border: 1px solid rgba(24, 144, 255, 0.1);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out forwards;
  opacity: 0;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.div`
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 24px;
`;

const audiences = [
  {
    icon: <SolutionOutlined />,
    title: 'Students',
    description: 'Those who want to learn a foreign language on their own but lack a conversation partner.',
    animationDelay: '0.4s'
  },
  {
    icon: <UsergroupAddOutlined />,
    title: 'Teachers',
    description: 'Those who want to check their students\' homework for AI-generated content.',
    animationDelay: '0.6s'
  },
  {
    icon: <GlobalOutlined />,
    title: 'Language Enthusiasts',
    description: 'Individuals passionate about mastering new languages and seeking modern tools.',
    animationDelay: '0.8s'
  }
];

export default function TargetAudienceSection() {
  return (
    <SectionContainer id="target-audience">
      <ContentWrapper>
        <SectionTitle level={2}>Target Audience</SectionTitle>
        <Row gutter={[32, 32]} justify="center">
          {audiences.map((audience, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <AudienceCard style={{ animationDelay: audience.animationDelay }}>
                <IconWrapper>{audience.icon}</IconWrapper>
                <Title level={4}>{audience.title}</Title>
                <Paragraph>{audience.description}</Paragraph>
              </AudienceCard>
            </Col>
          ))}
        </Row>
      </ContentWrapper>
    </SectionContainer>
  );
}
