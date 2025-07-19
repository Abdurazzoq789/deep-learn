import { Modal, Form, Input, Typography, Alert } from 'antd';
import { useEssayCheck } from '@/hooks/useEssayCheck';
import { useState } from 'react';

const { TextArea } = Input;
const { Paragraph } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
}

const EssayCheckerModal: React.FC<Props> = ({ open, onClose }) => {
  const [form] = Form.useForm<{ text: string }>();
  const [submittedText, setSubmittedText] = useState('');
  const essayCheck = useEssayCheck();

  const handleSubmit = async () => {
    try {
      const { text } = await form.validateFields();
      setSubmittedText(text);
      await essayCheck.mutateAsync({ text });
    } catch {
      // validation error ignored
    }
  };

  const handleAfterClose = () => {
    form.resetFields();
    essayCheck.reset();
    setSubmittedText('');
  };

  return (
    <Modal
      title="Essay Checking Demo"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      afterClose={handleAfterClose}
      okText="Check Essay"
      confirmLoading={essayCheck.isPending}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="text"
          label="Paste your essay text"
          rules={[{ required: true, message: 'Essay text is required' }]}
        >
          <TextArea rows={8} placeholder="Enter essay here..." />
        </Form.Item>
      </Form>

      {essayCheck.isError && (
        <Alert type="error" message={essayCheck.error?.message || 'Error occurred'} />
      )}


      {essayCheck.isSuccess && (
        <div style={{ marginTop: 24 }}>
          <Typography.Title level={4}>AI Feedback</Typography.Title>
          <Paragraph style={{ whiteSpace: 'pre-line' }}>{essayCheck.data.response}</Paragraph>
        </div>
      )}
    </Modal>
  );
};

export default EssayCheckerModal;
