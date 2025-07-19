import { Modal, Form, Input, Typography, Alert, Progress } from 'antd';
import { useAIDetect } from '@/hooks/useAIDetect';
import { useState } from 'react';
import { log } from 'console';

const { TextArea } = Input;

interface Props {
  open: boolean;
  onClose: () => void;
}

const AIDetectorModal: React.FC<Props> = ({ open, onClose }) => {
  const [form] = Form.useForm<{ text: string }>();
  const [submittedText, setSubmittedText] = useState('');
  const aiDetect = useAIDetect();

  const handleSubmit = async () => {
    try {
      const { text } = await form.validateFields();
      setSubmittedText(text);
      await aiDetect.mutateAsync({ text });
    } catch (_) {}
  };

  const handleAfterClose = () => {
    form.resetFields();
    aiDetect.reset();
    setSubmittedText('');
  };

  const renderResult = () => {
    if (!aiDetect.isSuccess) return null;
    const ai = aiDetect.data.result?.ai;
    const human = aiDetect.data.result?.human;
    return (
      <div style={{ marginTop: 24 }}>
        <Typography.Title level={4}>Detection Result</Typography.Title>
        <Progress percent={ai} status="exception" showInfo={false} strokeColor="#ff4d4f" />
        <Typography.Text>AI generated: {ai}%</Typography.Text>
        <br />
        <Progress percent={human} showInfo={false} strokeColor="#52c41a" />
        <Typography.Text>Human written: {human}%</Typography.Text>
      </div>
    );
  };

  return (
    <Modal
      title="AI Detector Demo"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      afterClose={handleAfterClose}
      okText="Detect"
      confirmLoading={aiDetect.isPending}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="text"
          label="Paste text to analyze"
          rules={[{ required: true, message: 'Text is required' }]}
        >
          <TextArea rows={8} placeholder="Enter text here..." />
        </Form.Item>
      </Form>

      {aiDetect.isError && <Alert type="error" message={aiDetect.error?.message || 'Error occurred'} />}
      {renderResult()}
    </Modal>
  );
};

export default AIDetectorModal;
