'use client';

import { Typography, Timeline } from 'antd';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { CheckCircleOutlined, ClockCircleOutlined, RocketOutlined } from '@ant-design/icons';

const { Title } = Typography;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SectionContainer = styled.section`
  padding: 80px 0;
  background-color: #fff;
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
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

const StyledTimeline = styled(Timeline)`
  text-align: left;
  animation: ${fadeIn} 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.4s;

  .ant-timeline-item-label {
    width: 200px !important;
    font-weight: bold;
  }
`;

const milestones = [
  {
    label: 'Q1 2024 - Idea & Team Formation',
    children: 'The initial concept for the AI learning platform was born, and a dedicated team was assembled to bring it to life.',
    dot: <CheckCircleOutlined />,
    color: 'green'
  },
  {
    label: 'Q2 2024 - MVP Development',
    children: 'Developed the Minimum Viable Product (MVP) featuring the core AI Teacher and Essay Checking functionalities.',
    dot: <CheckCircleOutlined />,
    color: 'green'
  },
  {
    label: 'Q3 2024 - Beta Testing & Feedback',
    children: 'Launched a closed beta program with a small group of users to gather feedback and identify areas for improvement.',
    dot: <ClockCircleOutlined />,
    color: 'blue'
  },
  {
    label: 'Q4 2024 - Public Launch',
    children: 'Planning the official public launch of the platform, making it available to a wider audience of students and teachers.',
    dot: <RocketOutlined />,
    color: 'blue'
  }
];

export default function MilestonesSection() {
  return (
    <SectionContainer id="milestones">
      <ContentWrapper>
        <SectionTitle level={2}>Our Milestones</SectionTitle>
        <StyledTimeline mode="alternate" items={milestones} />
      </ContentWrapper>
    </SectionContainer>
  );
}
