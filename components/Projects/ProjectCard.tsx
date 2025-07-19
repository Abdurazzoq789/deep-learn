import { Card, Typography, Tag, Space, Badge } from 'antd';
import styled from '@emotion/styled';
import { Project } from '@/types/project';
import Image from 'next/image';
import ProjectActions from './ProjectActions';
import { formatCategory } from '@/utils/projectUtils';

const { Title, Paragraph } = Typography;

const StyledCard = styled(Card)`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f0;
  
  .ant-card-cover {
    overflow: hidden;
    height: 200px;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
      z-index: 1;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    img {
      transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
  
  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
  }
  
  .ant-card-meta-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: #2c3e50;
    line-height: 1.4;
  }
  
  .ant-card-meta-description {
    color: #666;
    margin-bottom: 16px;
    line-height: 1.6;
    flex-grow: 1;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(24, 144, 255, 0.1);
    border-color: rgba(24, 144, 255, 0.2);
    
    .ant-card-cover {
      &::before {
        opacity: 1;
      }
      
      img {
        transform: scale(1.05);
      }
    }
  }
`;

const CategoryBadge = styled(Badge.Ribbon)`
  .ant-ribbon {
    font-size: 12px;
    font-weight: 600;
    padding: 0 12px;
    height: 26px;
    line-height: 26px;
  }
`;

const TagsContainer = styled.div`
  margin: 12px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  .ant-tag {
    margin: 0;
    border-radius: 4px;
    font-size: 0.7rem;
    padding: 0 10px;
    height: 24px;
    line-height: 22px;
    background: #f5f7fa;
    border: 1px solid #e8eef7;
    color: #4a6da7;
    font-weight: 500;
    
    &:hover {
      background: #e6f7ff;
      color: #1890ff;
      border-color: #91d5ff;
    }
  }
`;

const ProjectImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .project-category {
    position: absolute;
    top: 16px;
    right: 0;
    background: rgba(24, 144, 255, 0.9);
    color: white;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 4px 0 0 4px;
    box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 2;
  }
`;

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onView?: (project: Project) => void;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onView,
  className,
}) => {
  const { id, title, description, imageUrl, tags, category, githubUrl, demoUrl } = project;
  
  const handleView = () => {
    if (onView) {
      onView(project);
    } else if (demoUrl) {
      window.open(demoUrl, '_blank', 'noopener,noreferrer');
    } else if (githubUrl) {
      window.open(githubUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <CategoryBadge 
      text={formatCategory(category)} 
      color="blue"
      placement="end"
      className={className}
    >
      <StyledCard
        hoverable
        onClick={handleView}
        style={{ cursor: onView || demoUrl || githubUrl ? 'pointer' : 'default' }}
      >
        <ProjectImage>
          <Image
            src={imageUrl || '/images/project-placeholder.jpg'}
            alt={title}
            width={400}
            height={200}
            style={{ objectFit: 'cover' }}
          />
          <div className="project-category">
            {formatCategory(category)}
          </div>
        </ProjectImage>
        
        <Card.Meta
          title={
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Title level={5} style={{ margin: 0 }}>{title}</Title>
            </Space>
          }
          description={
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Paragraph 
                ellipsis={{ rows: 3 }} 
                style={{ 
                  margin: 0, 
                  minHeight: 72,
                  color: '#5a6e8c',
                }}
              >
                {description}
              </Paragraph>
              
              {tags && tags.length > 0 && (
                <TagsContainer>
                  {tags.slice(0, 3).map((tag: string, index: number) => (
                    <Tag key={index}>
                      {tag}
                    </Tag>
                  ))}
                  {tags.length > 3 && (
                    <Tag>+{tags.length - 3} more</Tag>
                  )}
                </TagsContainer>
              )}
            </Space>
          }
        />
        
        {/* {(onEdit || onDelete || onView || githubUrl || demoUrl) && (
          <ProjectActions
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        )} */}
      </StyledCard>
    </CategoryBadge>
  );
};

export default ProjectCard;
