import { Row, Col, Typography, Spin, Empty, Input, Button, Tag, Space, Modal, Dropdown } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import { useProjects } from '@/hooks/useProjects';
import { getUniqueCategories, filterProjects } from '@/utils/projectUtils';
import useProjectMutations from '@/hooks/useProjectMutations';
import { useState, useMemo } from 'react';
import { Project } from '@/types/project';

const { Title, Text } = Typography;
const { Search } = Input;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 80px 0;
  background: #fff;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
    z-index: -1;
    transform: skewY(-2deg);
    transform-origin: 0;
  }
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  max-width: 500px;
  min-width: 280px;
  
  .ant-input-affix-wrapper {
    height: 48px;
    border-radius: 24px;
    padding: 0 20px;
    border: 1px solid #e0e9ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.08);
    transition: all 0.3s;
    
    &:hover, &:focus {
      border-color: #1890ff;
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.12);
    }
    
    .ant-input {
      font-size: 15px;
      color: #2c3e50;
      
      &::placeholder {
        color: #a0aec0;
      }
    }
    
    .ant-input-prefix {
      margin-right: 10px;
      color: #a0aec0;
    }
  }
`;

const FilterDropdown = styled(Dropdown)`
  .ant-btn {
    height: 48px;
    padding: 0 24px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    border: 1px solid #e0e9ff;
    background: white;
    color: #4a5568;
    transition: all 0.3s;
    
    &:hover, &:focus {
      color: #1890ff;
      border-color: #1890ff;
    }
    
    .anticon {
      font-size: 16px;
    }
  }
`;

const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  margin: 0 auto 40px;
  height: 48px;
  padding: 0 32px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(90deg, #1890ff 0%, #36cfc9 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out 0.4s forwards;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(24, 144, 255, 0.3);
  }
  
  .anticon {
    font-size: 16px;
    margin-right: 8px;
  }
`;

const CategoryTag = styled(Tag)`
  padding: 6px 20px;
  border-radius: 20px;
  margin-right: 0;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  
  &.active, &:hover {
    background: linear-gradient(90deg, #1890ff 0%, #36cfc9 100%);
    color: white;
    border-color: transparent;
  }
  
  @media (max-width: 768px) {
    padding: 4px 16px;
    font-size: 13px;
  }
`;

const ProjectsGridContainer = styled(Row)`
  margin: 0 -12px;
  
  .ant-col {
    padding: 12px;
  }
  
  @media (max-width: 768px) {
    margin: 0 -8px;
    
    .ant-col {
      padding: 8px;
    }
  }
`;

const EmptyState = styled(Empty)`
  margin: 60px 0;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out 0.4s forwards;
  
  .ant-empty-image {
    height: 200px;
    margin-bottom: 24px;
    
    svg {
      width: 100%;
      height: 100%;
    }
  }
  
  .ant-empty-description {
    color: #718096;
    font-size: 16px;
    margin-bottom: 24px;
  }
  
  .ant-btn {
    height: 44px;
    padding: 0 32px;
    font-weight: 500;
    border-radius: 8px;
    background: linear-gradient(90deg, #1890ff 0%, #36cfc9 100%);
    border: none;
    color: white;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    }
  }
`;

const SectionTitle = styled(Typography.Title)`
  text-align: center !important;
  margin-bottom: 16px !important;
  font-weight: 700 !important;
  color: #1a365d !important;
  font-size: 2.5rem !important;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out 0.1s forwards;
  
  @media (max-width: 768px) {
    font-size: 2rem !important;
  }
`;

const SectionSubtitle = styled(Typography.Paragraph)`
  text-align: center !important;
  max-width: 800px;
  margin: 0 auto 60px !important;
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.7;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out 0.2s forwards;
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 40px;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out 0.3s forwards;
  
  .ant-input {
    font-size: 16px;
    padding: 12px 20px;
    border-radius: 30px;
    transition: all 0.3s ease;
    
    &:hover, &:focus {
      border-color: #36cfc9;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
  
  .ant-input-prefix {
    margin-right: 10px;
    color: #a0aec0;
  }
`;

const ProjectsGrid = styled(Row)`
  margin: 0 -12px;
  
  .ant-col {
    padding: 12px;
  }
  
  @media (max-width: 768px) {
    margin: 0 -8px;
    
    .ant-col {
      padding: 8px;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out 0.3s forwards;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  width: 100%;
  text-align: center;
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out 0.3s forwards;
  
  .ant-typography {
    margin-top: 16px;
    color: #8c8c8c;
  }
`;

export default function ProjectsSection() {
  const { data: projects = [], isLoading, isError, error } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Get all available categories
  const categories = useMemo(() => {
    return ['all', ...getUniqueCategories(projects)];
  }, [projects]);
  
  // Filter projects based on search query and selected category
  const filteredProjects = useMemo(() => {
    return filterProjects(projects, searchQuery, selectedCategory === 'all' ? '' : selectedCategory);
  }, [projects, searchQuery, selectedCategory]);
  
  // Get featured projects for the top section
  const featuredProjects = useMemo(() => {
    return projects.slice(0, 3); // First 3 projects as featured
  }, [projects]);
  
  // CRUD operations
  const { createProject, updateProject, deleteProject } = useProjectMutations();
  
  const handleCreate = async (values: Omit<Project, 'id'>) => {
    try {
      await createProject.mutateAsync(values);
      setIsFormVisible(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };
  
  const handleUpdate = async (updatedProject: Project) => {
    try {
      await updateProject.mutateAsync(updatedProject);
      setEditingProject(null);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };
  
  const handleDelete = async (projectId: string) => {
    Modal.confirm({
      title: 'Delete Project',
      content: 'Are you sure you want to delete this project? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteProject.mutateAsync(projectId);
        } catch (error) {
          console.error('Failed to delete project:', error);
        }
      },
    });
  };
  
  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };
  
  const handleView = (project: Project) => {
    console.log('View project:', project);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingContainer>
          <Spin size="large" />
        </LoadingContainer>
      );
    }
  
    if (isError) {
      return (
        <EmptyContainer>
          <Empty 
            description={
              <Text type="secondary">
                Failed to load projects. Please try again later.
              </Text>
            } 
          />
        </EmptyContainer>
      );
    }
  
    if (!filteredProjects.length) {
      return (
        <EmptyContainer>
          <Empty 
            description={
              <Text type="secondary">
                No projects found matching your criteria. Try adjusting your search or filters.
              </Text>
            } 
          />
        </EmptyContainer>
      );
    }
  
    return (
      <>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Space wrap>
            <Tag 
              color={selectedCategory === 'all' ? 'blue' : 'default'}
              onClick={() => setSelectedCategory('all')}
              style={{ cursor: 'pointer', padding: '4px 16px' }}
            >
              All Projects
            </Tag>
            {categories.filter(cat => cat !== 'all').map(category => (
              <Tag 
                key={category}
                color={selectedCategory === category ? 'blue' : 'default'}
                onClick={() => setSelectedCategory(category)}
                style={{ cursor: 'pointer', padding: '4px 16px' }}
              >
                {category}
              </Tag>
            ))}
          </Space>
        </div>
        <ProjectsGrid gutter={[24, 32]}>
          {filteredProjects.map((project) => (
            <Col key={project.id} xs={24} sm={12} lg={8}>
              <ProjectCard project={project} />
            </Col>
          ))}
        </ProjectsGrid>
      </>
    );
  };

  return (
    <Section id="projects">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <SectionTitle level={2}>Our AI Projects</SectionTitle>
        <SectionSubtitle>
          Explore our collection of AI-powered projects that showcase innovation and technical excellence.
          Each project demonstrates our expertise in artificial intelligence and machine learning.
        </SectionSubtitle>
        
        <SearchContainer>
          <Input
            placeholder="Search projects by title, description, or tags..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              borderRadius: '24px',
              padding: '10px 20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
        </SearchContainer>
        
        {renderContent()}
      </div>
    </Section>
  );
}
