import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { Project } from './useProjects';
import { message } from 'antd';

const PROJECTS_QUERY_KEY = 'projects';

interface ProjectMutations {
  createProject: UseMutationResult<Project, Error, Omit<Project, 'id'>>;
  updateProject: UseMutationResult<Project, Error, Project>;
  deleteProject: UseMutationResult<string, Error, string>;
}

export const useProjectMutations = (): ProjectMutations => {
  const queryClient = useQueryClient();
  const PROJECTS_QUERY_KEY = 'projects';

  const createMutation = useMutation<Project, Error, Omit<Project, 'id'>>({
    mutationFn: async (newProject) => {
      // In a real app, this would be an API call
      // const response = await api.post<Project>('/api/projects', newProject);
      // return response.data;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new project with a generated ID
      return {
        ...newProject,
        id: Date.now().toString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      message.success('Project created successfully');
    },
    onError: () => {
      message.error('Failed to create project');
    },
  });

  const updateMutation = useMutation<Project, Error, Project>({
    mutationFn: async (updatedProject) => {
      // In a real app, this would be an API call
      // const response = await api.put<Project>(`/api/projects/${updatedProject.id}`, updatedProject);
      // return response.data;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return updatedProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      message.success('Project updated successfully');
    },
    onError: () => {
      message.error('Failed to update project');
    },
  });

  const deleteMutation = useMutation<string, Error, string>({
    mutationFn: async (projectId) => {
      // In a real app, this would be an API call
      // await api.delete(`/api/projects/${projectId}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return projectId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      message.success('Project deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete project');
    },
  });

  return {
    createProject: createMutation,
    updateProject: updateMutation,
    deleteProject: deleteMutation,
  };
};

export default useProjectMutations;
