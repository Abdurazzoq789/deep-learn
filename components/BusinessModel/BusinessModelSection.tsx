'use client';

import { Typography, Row, Col, Card } from 'antd';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { UserOutlined, ApartmentOutlined } from '@ant-design/icons';

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

const ModelCard = styled(Card)`
  height: 100%;
  border-radius: 16px;
  border: 1px solid rgba(24, 144, 255, 0.1);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out forwards;
  opacity: 0;
  padding: 24px;

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

const models = [
  {
    icon: <UserOutlined />,
    title: 'B2C (Business-to-Consumer)',
    description: 'We offer our platform directly to individual learners, providing them with affordable and accessible tools for self-education in foreign languages.',
    animationDelay: '0.4s'
  },
  {
    icon: <ApartmentOutlined />,
    title: 'B2B (Business-to-Business)',
    description: 'We partner with educational institutions and language schools, offering our AI Detector and other tools to enhance their curriculum and teaching methods.',
    animationDelay: '0.6s'
  }
];

export default function BusinessModelSection() {
  return (
    <SectionContainer id="business-model">
      <ContentWrapper>
        <SectionTitle level={2}>Business Model</SectionTitle>
        <Row gutter={[32, 32]} justify="center">
          {models.map((model, index) => (
            <Col key={index} xs={24} sm={12} md={10}>
              <ModelCard style={{ animationDelay: model.animationDelay }}>
                <IconWrapper>{model.icon}</IconWrapper>
                <Title level={4}>{model.title}</Title>
                <Paragraph>{model.description}</Paragraph>
              </ModelCard>
            </Col>
          ))}
        </Row>
      </ContentWrapper>
    </SectionContainer>
  );
}
