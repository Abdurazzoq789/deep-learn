import { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Select, Space, Upload, message, UploadFile, UploadProps } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Project } from '@/types/project';
import { formatCategory } from '@/utils/projectUtils';

const { TextArea } = Input;
const { Option } = Select;

interface ProjectFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Project, 'id'>) => Promise<void>;
  initialValues?: Project | null;
  loading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Initialize form with initial values
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.imageUrl) {
        setFileList([
          {
            uid: '-1',
            name: 'project-image',
            status: 'done',
            url: initialValues.imageUrl,
          },
        ]);
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [initialValues, form]);

  // Load categories from existing projects
  useEffect(() => {
    // In a real app, you might fetch these from an API
    const defaultCategories = [
      'Machine Learning',
      'Computer Vision',
      'NLP',
      'IoT',
      'Web Development',
      'Mobile Development',
    ];
    setCategories(defaultCategories);
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        ...values,
        tags: Array.isArray(values.tags) ? values.tags : [],
        imageUrl: fileList[0]?.url || '',
      });
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      open={open}
      title={initialValues ? 'Edit Project' : 'Add New Project'}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={700}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {initialValues ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          tags: [],
        }}
      >
        <Form.Item
          name="title"
          label="Project Title"
          rules={[{ required: true, message: 'Please input the project title!' }]}
        >
          <Input placeholder="Enter project title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: 'Please input the project description!' },
          ]}
        >
          <TextArea rows={4} placeholder="Enter project description" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select
            showSearch
            placeholder="Select a category"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {categories.map((category) => (
              <Option key={category} value={category}>
                {formatCategory(category)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
          rules={[
            {
              type: 'array',
              max: 5,
              message: 'You can add up to 5 tags!',
            },
          ]}
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add tags (press Enter to add a new tag)"
            tokenSeparators={[',']}
          />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Project Image"
          rules={[
            { required: true, message: 'Please upload a project image!' },
          ]}
        >
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // Replace with your upload endpoint
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            onPreview={() => {}}
            beforeUpload={() => false} // Prevent auto upload
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item name="githubUrl" label="GitHub URL">
          <Input
            prefix={<i className="fab fa-github" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="https://github.com/username/repo"
          />
        </Form.Item>

        <Form.Item name="demoUrl" label="Live Demo URL">
          <Input
            prefix={<i className="fas fa-external-link-alt" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="https://example.com/demo"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectForm;
