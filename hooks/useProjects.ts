import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  category: string;
  githubUrl?: string;
  demoUrl?: string;
}

const PROJECTS_QUERY_KEY = 'projects';

// Mock data that matches our UI components
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Analytics Platform',
    description: 'A comprehensive analytics platform that uses machine learning to provide actionable insights from your data.',
    imageUrl: '/images/projects/analytics-platform.jpg',
    tags: ['Machine Learning', 'Data Visualization', 'Cloud'],
    category: 'Machine Learning',
    githubUrl: 'https://github.com/yourusername/analytics-platform',
    demoUrl: 'https://analytics-demo.example.com'
  },
  {
    id: '2',
    title: 'Computer Vision for Retail',
    description: 'Advanced computer vision solutions for retail analytics and customer behavior tracking.',
    imageUrl: '/images/projects/retail-vision.jpg',
    tags: ['Computer Vision', 'Retail', 'AI'],
    category: 'Computer Vision',
    githubUrl: 'https://github.com/yourusername/retail-vision',
    demoUrl: 'https://retail-vision-demo.example.com'
  },
  {
    id: '3',
    title: 'Natural Language Processing API',
    description: 'A powerful NLP API for text analysis, sentiment analysis, and language understanding.',
    imageUrl: '/images/projects/nlp-api.jpg',
    tags: ['NLP', 'API', 'AI'],
    category: 'NLP',
    githubUrl: 'https://github.com/yourusername/nlp-api',
    demoUrl: 'https://nlp-api-demo.example.com'
  },
  {
    id: '4',
    title: 'Predictive Maintenance System',
    description: 'IoT and AI-powered system for predicting equipment failures before they occur.',
    imageUrl: '/images/projects/predictive-maintenance.jpg',
    tags: ['IoT', 'Predictive Analytics', 'AI'],
    category: 'IoT',
    githubUrl: 'https://github.com/yourusername/predictive-maintenance',
    demoUrl: 'https://predictive-maintenance-demo.example.com'
  }
];

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: [PROJECTS_QUERY_KEY],
    queryFn: async () => {
      // In a real app, this would be an API call
      // const response = await api.get<Project[]>('/api/projects');
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockProjects);
        }, 500); // Simulate network delay
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation<Project, Error, Omit<Project, 'id'>>({
    mutationFn: async (newProject) => {
      // In a real app, this would be an API call
      // const response = await api.post<Project>('/api/projects', newProject);
      // return response.data;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new project with a generated ID
      const createdProject: Project = {
        ...newProject,
        id: Date.now().toString(),
      };
      
      // Update the cache
      queryClient.setQueryData<Project[]>([PROJECTS_QUERY_KEY], (oldData = []) => [
        ...oldData,
        createdProject,
      ]);
      
      return createdProject;
    },
    onSuccess: () => {
      // Invalidate and refetch projects after successful creation
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation<Project, Error, Project>({
    mutationFn: async (updatedProject) => {
      // In a real app, this would be an API call
      // const response = await api.put<Project>(`/api/projects/${updatedProject.id}`, updatedProject);
      // return response.data;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the cache
      queryClient.setQueryData<Project[]>([PROJECTS_QUERY_KEY], (oldData = []) =>
        oldData.map(project =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
      
      return updatedProject;
    },
    onSuccess: () => {
      // Invalidate and refetch projects after successful update
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: async (projectId) => {
      // In a real app, this would be an API call
      // await api.delete(`/api/projects/${projectId}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the cache
      queryClient.setQueryData<Project[]>([PROJECTS_QUERY_KEY], (oldData = []) =>
        oldData.filter(project => project.id !== projectId)
      );
    },
    onSuccess: () => {
      // Invalidate and refetch projects after successful deletion
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
  });
}
