import { useState } from 'react';
import { Row, Col, Typography, Form, Input, Button, message, Card } from 'antd';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 100px 0;
  background: linear-gradient(135deg, #f6f9fc 0%, #f1f8ff 100%);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled(Title)`
  text-align: center;
  margin-bottom: 16px !important;
  font-size: 2.5rem !important;
  color: #2c3e50 !important;
  position: relative;
  display: inline-block;
  margin: 0 auto 16px !important;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #1890ff 0%, #36cfc9 100%);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem !important;
  }
`;

const SectionSubtitle = styled(Paragraph)`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 64px !important;
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
`;

const ContactCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  }
  
  .ant-card-body {
    padding: 40px;
  }
`;

const ContactForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 20px;
  }
  
  .ant-input, .ant-input-textarea {
    border-radius: 8px;
    padding: 12px 16px;
    border: 1px solid #e0e6ed;
    transition: all 0.3s;
    
    &:focus, &:hover {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
  
  .ant-btn {
    height: 48px;
    font-weight: 500;
    font-size: 1rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: linear-gradient(90deg, #1890ff 0%, #36cfc9 100%);
    border: none;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(24, 144, 255, 0.2);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

const ContactInfo = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .anticon {
    font-size: 24px;
    color: #1890ff;
    margin-right: 16px;
    margin-top: 4px;
  }
  
  .info-content {
    h4 {
      font-size: 1.1rem;
      margin-bottom: 8px;
      color: #2c3e50;
    }
    
    p, a {
      color: #666;
      margin: 0;
      transition: color 0.3s;
    }
    
    a:hover {
      color: #1890ff;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  
  a {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 20px;
    transition: all 0.3s;
    
    &:hover {
      background: #1890ff;
      color: white;
      transform: translateY(-3px);
    }
  }
`;

const ContactSection = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('Your message has been sent successfully!');
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact">
      <Container className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionTitle level={2}>Get In Touch</SectionTitle>
          <SectionSubtitle>
            Have a question or want to discuss a project? Feel free to reach out to us using the form below or through our contact information.
          </SectionSubtitle>
        </div>

        <Row gutter={[48, 48]}>
          <Col xs={24} lg={12} style={{ animation: `${fadeIn} 0.6s ease-out 0.2s forwards` }}>
            <ContactCard>
              <ContactForm form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item 
                  name="name" 
                  rules={[{ required: true, message: 'Please input your name!' }]}
                >
                  <Input placeholder="Your Name" size="large" />
                </Form.Item>
                
                <Form.Item 
                  name="email" 
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email address!' }
                  ]}
                >
                  <Input placeholder="Your Email" size="large" />
                </Form.Item>
                
                <Form.Item 
                  name="subject" 
                  rules={[{ required: true, message: 'Please input the subject!' }]}
                >
                  <Input placeholder="Subject" size="large" />
                </Form.Item>
                
                <Form.Item 
                  name="message" 
                  rules={[{ required: true, message: 'Please input your message!' }]}
                >
                  <TextArea rows={6} placeholder="Your Message" />
                </Form.Item>
                
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large"
                    loading={loading}
                    icon={<SendOutlined />}
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </ContactForm>
            </ContactCard>
          </Col>
          
          <Col xs={24} lg={12} style={{ animation: `${fadeIn} 0.6s ease-out 0.4s forwards` }}>
            <ContactCard style={{ height: '100%' }}>
              <ContactInfo>
                <div>
                  <Title level={3} style={{ marginBottom: 32, color: '#2c3e50' }}>Contact Information</Title>
                  
                  <InfoItem>
                    <MailOutlined />
                    <div className="info-content">
                      <h4>Email Us</h4>
                      <a href="mailto:contact@aiprojects.com">contact@aiprojects.com</a>
                    </div>
                  </InfoItem>
                  
                  <InfoItem>
                    <PhoneOutlined />
                    <div className="info-content">
                      <h4>Call Us</h4>
                      <a href="tel:+998946001702">+998 94 600 17 02</a>
                    </div>
                  </InfoItem>
                  
                  <InfoItem>
                    <EnvironmentOutlined />
                    <div className="info-content">
                      <h4>Location</h4>
                      <p>123 AI Street, Tech Valley, CA 94025, USA</p>
                    </div>
                  </InfoItem>
                </div>
                
                <div>
                  <h4 style={{ marginBottom: 16, color: '#2c3e50' }}>Follow Us</h4>
                  <SocialLinks>
                    <a href="https://t.me/aabdurazzoq" target="_blank" rel="noopener" aria-label="Telegram"><i className="fab fa-telegram-plane"></i></a>
                    <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                    <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
                    <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#" aria-label="Dribbble"><i className="fab fa-dribbble"></i></a>
                  </SocialLinks>
                </div>
              </ContactInfo>
            </ContactCard>
          </Col>
        </Row>
      </Container>
    </Section>
  );
};

export default ContactSection;
