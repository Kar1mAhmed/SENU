// Hook to fetch a single project with slides and extra fields from backend API
'use client';
import { useState, useEffect } from 'react';
import { projectsAPI } from '@/lib/api-client';
import { ProjectWithSlides } from '@/lib/types';

console.log('🎯 ProjectWithSlides hook loaded - ready to fetch detailed project data!');

export function useProjectWithSlides(projectName: string) {
  const [project, setProject] = useState<ProjectWithSlides | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      console.log('📋 Fetching project with slides:', projectName);
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all projects and find the matching one
        const response = await projectsAPI.getAll({ limit: 100 });
        
        if (response && response.items) {
          // Convert URL-friendly name back to project name and find matching project
          const decodedName = decodeURIComponent(projectName).replace(/-/g, ' ');
          const foundProject = response.items.find(p =>
            p.name.toLowerCase() === decodedName.toLowerCase()
          );

          if (foundProject) {
            setProject(foundProject);
            console.log('✅ Found project with slides:', foundProject.name);
          } else {
            setError('Project not found');
            console.log('❌ Project not found for name:', decodedName);
          }
        } else {
          console.log('⚠️ No projects data received from API');
          setError('No projects data available');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project';
        console.error('❌ Error fetching project:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (projectName) {
      fetchProject();
    }
  }, [projectName]);

  return {
    project,
    loading,
    error
  };
}
