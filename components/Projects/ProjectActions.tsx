import { useState } from 'react';
import { Button, Dropdown, Menu, Modal, Space, Tooltip, message } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EllipsisOutlined, 
  EyeOutlined,
  GithubOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { Project } from '@/hooks/useProjects';
import ProjectForm from './ProjectForm';

interface ProjectActionsProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onView?: (project: Project) => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  project,
  onEdit,
  onDelete,
  onView,
}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!onDelete) return;
    
    try {
      setIsSubmitting(true);
      await onDelete(project.id);
      message.success('Project deleted successfully');
      setIsDeleteModalVisible(false);
    } catch (error) {
      message.error('Failed to delete project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (values: Omit<Project, 'id'>) => {
    if (!onEdit) return;
    
    try {
      setIsSubmitting(true);
      await onEdit({ ...values, id: project.id });
      message.success('Project updated successfully');
      setIsEditModalVisible(false);
    } catch (error) {
      message.error('Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const menu = (
    <Menu
      items={[
        {
          key: 'view',
          label: 'View Details',
          icon: <EyeOutlined />,
          onClick: () => onView?.(project),
        },
        {
          key: 'edit',
          label: 'Edit',
          icon: <EditOutlined />,
          onClick: handleEdit,
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: <DeleteOutlined />,
          danger: true,
          onClick: handleDelete,
        },
      ]}
    />
  );

  return (
    <>
      <Space style={{ marginTop: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          {project.githubUrl && (
            <Tooltip title="View on GitHub">
              <Button 
                type="text" 
                icon={<GithubOutlined />} 
                href={project.githubUrl} 
                target="_blank"
                rel="noopener noreferrer"
              />
            </Tooltip>
          )}
          {project.demoUrl && (
            <Tooltip title="View Live Demo">
              <Button 
                type="text" 
                icon={<LinkOutlined />} 
                href={project.demoUrl} 
                target="_blank"
                rel="noopener noreferrer"
              />
            </Tooltip>
          )}
        </Space>
        
        <Dropdown overlay={menu} trigger={['click']}>
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      </Space>

      {/* Edit Project Modal */}
      <ProjectForm
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSubmit={handleEditSubmit}
        initialValues={project}
        loading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Project"
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        confirmLoading={isSubmitting}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete the project "{project.title}"?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default ProjectActions;
