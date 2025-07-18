import { Button, Typography, Space, Row, Col } from 'antd';
import styled from '@emotion/styled';
import { ArrowRightOutlined, RobotOutlined, CloudServerOutlined, CodeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { keyframes } from '@emotion/react';

const { Title, Paragraph } = Typography;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroContainer = styled.section`
  position: relative;
  text-align: center;
  padding: 100px 0 120px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f7ff 100%);
  overflow: hidden;
  margin-bottom: 80px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.74-6.724 2.616l-1.47.625C7.233 21.87 3.5 23 0 24h6.03c.5 0 .985-.05 1.46-.145l.26-.043c2.24-.376 3.96-.812 6.05-1.812z' fill='%23d6e8ff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const StyledTitle = styled(Title)`
  font-size: 3.5rem !important;
  margin-bottom: 24px !important;
  background: linear-gradient(90deg, #1890ff 0%, #36cfc9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeIn} 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.2s;
  line-height: 1.2 !important;
  
  @media (max-width: 768px) {
    font-size: 2.5rem !important;
  }
`;

const StyledParagraph = styled(Paragraph)`
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto 40px !important;
  color: #595959;
  animation: ${fadeIn} 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.4s;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CtaButton = styled(Button)`
  height: 52px;
  padding: 0 36px;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 4px 14px rgba(24, 144, 255, 0.3);
  animation: ${fadeIn} 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.6s;
  transition: all 0.3s ease;
  
  .anticon {
    margin-left: 10px;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
    
    .anticon {
      transform: translateX(5px);
    }
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 28px;
  color: #1890ff;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 12px;
  color: #2c3e50;
`;

const FeatureDescription = styled.p`
  color: #666;
  font-size: 0.95rem;
  margin: 0;
`;

export default function Hero() {
  const features = [
    {
      icon: <RobotOutlined />,
      title: 'AI-Powered',
      description: 'Leveraging cutting-edge artificial intelligence for intelligent solutions.'
    },
    {
      icon: <CloudServerOutlined />,
      title: 'Cloud Native',
      description: 'Built for the cloud with scalability and reliability in mind.'
    },
    {
      icon: <CodeOutlined />,
      title: 'Developer Friendly',
      description: 'Clean APIs and comprehensive documentation for easy integration.'
    }
  ];

  return (
    <>
      <HeroContainer>
        <ContentWrapper>
          <StyledTitle level={1}>
            Deep Learn
          </StyledTitle>
          <StyledParagraph>
            Don't be afraid to learn — AI is with you!
          </StyledParagraph>
          <Space size={16}>
            <Link href="/#projects" passHref>
              <CtaButton type="primary" size="large">
                Explore Projects
                <ArrowRightOutlined />
              </CtaButton>
            </Link>
            <Link href="/#contact" passHref>
              <CtaButton size="large" style={{ background: 'white', border: '1px solid #e8e8e8' }}>
                Contact Us
              </CtaButton>
            </Link>
          </Space>
        </ContentWrapper>
      </HeroContainer>
      
      <div className="container" style={{ marginTop: '-60px', marginBottom: '80px' }}>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <FeatureItem>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureItem>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}
