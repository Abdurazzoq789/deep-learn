'use client';

import { Typography, Row, Col, Card, Avatar } from 'antd';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TeamContainer = styled.section`
  padding: 80px 0;
  background-color: #fff;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 0 24px;
`;

const SectionTitle = styled(Title)`
  font-size: 2.8rem !important;
  margin-bottom: 24px !important;
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

const TeamCard = styled(Card)`
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out forwards;
  opacity: 0;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

const teamMembers = [
  {
    name: 'Jasurbek Yuldashov',
    role: 'Fullstack developer (Java script, Node Js)',
    avatar: '/images/team/jasurbek.jpeg', // Placeholder
    animationDelay: '0.4s'
  },
  {
    name: 'Abdurazzoq Rasulmuhammedov',
    role: 'AI Engineer (Python, Node js,PHP)',
    avatar: '/images/team/abdurazzoq.jpeg', // Placeholder
    animationDelay: '0.6s'
  },
  {
    name: 'Ziyodbek Ahmadjonov',
    role: 'Frontend Developer (Java script, React js)',
    avatar: '/images/team/ziyodbek.jpeg', // Placeholder
    animationDelay: '0.8s'
  }
];

export default function TeamSection() {
  return (
    <TeamContainer id="team">
      <ContentWrapper>
        <SectionTitle level={2}>Our Team</SectionTitle>
        <Row gutter={[32, 32]} style={{ marginTop: '60px' }} justify="center">
          {teamMembers.map((member, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <TeamCard style={{ animationDelay: member.animationDelay }}>
                <Meta
                  avatar={<Avatar size={80} icon={<UserOutlined />} src={member.avatar} />}
                  title={<Title level={4}>{member.name}</Title>}
                  description={<Text type="secondary">{member.role}</Text>}
                />
              </TeamCard>
            </Col>
          ))}
        </Row>
      </ContentWrapper>
    </TeamContainer>
  );
}
