import { Project } from '@/hooks/useProjects';

/**
 * Extracts unique categories from an array of projects
 * @param projects Array of projects
 * @returns Array of unique category strings
 */
export const getUniqueCategories = (projects: Project[]): string[] => {
  const categories = new Set<string>();
  projects.forEach(project => {
    categories.add(project.category);
  });
  return Array.from(categories);
};

/**
 * Filters projects based on search query and selected category
 * @param projects Array of projects to filter
 * @param searchQuery Search query string
 * @param selectedCategory Selected category (or 'all' for no category filter)
 * @returns Filtered array of projects
 */
export const filterProjects = (
  projects: Project[],
  searchQuery: string,
  selectedCategory: string
): Project[] => {
  const query = searchQuery.toLowerCase().trim();
  
  return projects.filter(project => {
    // Filter by search query (title, description, or tags)
    const matchesSearch = 
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.tags.some(tag => tag.toLowerCase().includes(query));
    
    // Filter by category
    const matchesCategory = 
      selectedCategory === 'all' || 
      project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
};

/**
 * Formats a project's category for display (capitalizes first letter, adds spaces)
 * @param category Raw category string
 * @returns Formatted category string
 */
export const formatCategory = (category: string): string => {
  // Convert camelCase or kebab-case to space-separated words
  const withSpaces = category
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ');
  
  // Capitalize first letter of each word
  return withSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
