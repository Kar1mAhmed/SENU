// Hook to fetch projects from backend API
'use client';
import { useState, useEffect } from 'react';
import { projectsAPI } from '@/lib/api-client';
import { transformProjectsForFrontend } from '@/lib/data-transform';
import { Project } from '@/lib/types';

console.log('🎯 Projects hook loaded - ready to fetch data like a data retrieval specialist!');

interface UseProjectsOptions {
  categoryId?: number;
  limit?: number;
}

export function useProjects(options: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      console.log('📋 Fetching projects with options:', options);
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await projectsAPI.getAll({
          categoryId: options.categoryId,
          limit: options.limit || 50
        });
        
        if (response && response.items) {
          // Transform database projects to frontend format
          const frontendProjects = transformProjectsForFrontend(response.items);
          setProjects(frontendProjects);
          console.log(`✅ Loaded ${frontendProjects.length} projects successfully`);
        } else {
          console.log('⚠️ No projects data received from API');
          setProjects([]);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
        console.error('❌ Error fetching projects:', errorMessage);
        setError(errorMessage);
        setProjects([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [options.categoryId, options.limit]);

  return {
    projects,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Re-trigger the effect by updating a dependency
    }
  };
}
