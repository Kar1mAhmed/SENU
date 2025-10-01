// Data transformation utilities for frontend compatibility
import { ProjectWithSlides, Project } from './types';
import { keyToUrl } from './media';

console.log('🔄 Data transformation utilities loaded - ready to convert data like a digital translator!');

/**
 * Transform database project with slides to the format expected by existing frontend components
 * This ensures compatibility with your existing ProjectCard and portfolio components
 */
export function transformProjectForFrontend(dbProject: ProjectWithSlides): Project {
  console.log('🔄 Transforming project for frontend:', dbProject.name);

  // Get thumbnail URL from key
  let imageUrl = keyToUrl(dbProject.thumbnailKey) || '';
  let videoUrl: string | undefined;

  if (dbProject.slides.length > 0) {
    // Sort slides by order and get the first one
    const firstSlide = dbProject.slides.sort((a, b) => a.order - b.order)[0];

    if (firstSlide.type === 'image') {
      imageUrl = keyToUrl(firstSlide.mediaKey) || imageUrl;
    } else {
      // For video slides, use the slide media as videoUrl and keep thumbnail as imageUrl
      videoUrl = keyToUrl(firstSlide.mediaKey) || undefined;
    }
  }

  const transformed: Project = {
    id: dbProject.id,
    name: dbProject.name,
    client: dbProject.client,
    clientLogo: keyToUrl(dbProject.clientLogoKey) || undefined,
    work: dbProject.tags, // Tags become work array
    imageUrl,
    videoUrl,
    description: dbProject.description,
    type: dbProject.type,
    category: dbProject.category,
    categoryId: dbProject.categoryId,
    thumbnailUrl: keyToUrl(dbProject.thumbnailKey) || '',
    iconBarBgColor: dbProject.iconBarBgColor || '#4FAF78', // Default green
    iconBarIconColor: dbProject.iconBarIconColor || '#FFFFFF' // Default white
  };

  console.log('✅ Project transformed:', {
    name: transformed.name,
    type: transformed.type,
    hasVideo: !!transformed.videoUrl,
    workCount: transformed.work.length
  });

  return transformed;
}

/**
 * Transform multiple database projects for frontend use
 */
export function transformProjectsForFrontend(dbProjects: ProjectWithSlides[]): Project[] {
  console.log('🔄 Transforming', dbProjects.length, 'projects for frontend');

  return dbProjects.map(transformProjectForFrontend);
}

/**
 * Get project statistics for dashboard
 */
export function getProjectStats(projects: ProjectWithSlides[]) {
  const stats = {
    total: projects.length,
    byType: {
      image: 0,
      horizontal: 0,
      vertical: 0
    },
    byCategory: {} as Record<string, number>,
    totalSlides: 0,
    averageSlidesPerProject: 0
  };

  projects.forEach(project => {
    // Count by type
    stats.byType[project.type]++;

    // Count by category
    stats.byCategory[project.category] = (stats.byCategory[project.category] || 0) + 1;

    // Count slides
    stats.totalSlides += project.slides.length;
  });

  // Calculate average
  stats.averageSlidesPerProject = stats.total > 0
    ? Math.round((stats.totalSlides / stats.total) * 10) / 10
    : 0;

  console.log('📊 Project statistics calculated:', stats);
  return stats;
}

/**
 * Filter projects by category (for compatibility with existing filter logic)
 */
export function filterProjectsByCategory(
  projects: ProjectWithSlides[],
  category: string
): ProjectWithSlides[] {
  if (category === 'All') {
    return projects;
  }

  const filtered = projects.filter(project => project.category === category);
  console.log(`🔍 Filtered ${projects.length} projects to ${filtered.length} for category:`, category);

  return filtered;
}

/**
 * Sort projects by creation date (newest first)
 */
export function sortProjectsByDate(projects: ProjectWithSlides[]): ProjectWithSlides[] {
  return [...projects].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get project type distribution for analytics
 */
export function getProjectTypeDistribution(projects: ProjectWithSlides[]) {
  const distribution = projects.reduce((acc, project) => {
    acc[project.type] = (acc[project.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('📈 Project type distribution:', distribution);
  return distribution;
}

/**
 * Validate project data before sending to API
 */
export function validateProjectData(data: {
  name: string;
  title: string;
  clientName: string;
  category: string;
  projectType: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Project name is required');
  }

  if (!data.title?.trim()) {
    errors.push('Project title is required');
  }

  if (!data.clientName?.trim()) {
    errors.push('Client name is required');
  }

  if (!data.category) {
    errors.push('Category is required');
  }

  if (!data.projectType) {
    errors.push('Project type is required');
  }

  const valid = errors.length === 0;

  if (!valid) {
    console.warn('⚠️ Project validation failed:', errors);
  }

  return { valid, errors };
}
