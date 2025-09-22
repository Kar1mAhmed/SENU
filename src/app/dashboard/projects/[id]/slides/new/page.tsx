// New slide creation page
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { projectsAPI, slidesAPI } from '@/lib/api-client';
import { ProjectWithSlides, SlideType } from '@/lib/types';

console.log('🎬 New slide page loaded - ready to create slides like a digital cinematographer!');

const slideTypes: SlideType[] = ['image', 'horizontal', 'vertical'];

interface NewSlideProps {
  params: Promise<{ id: string }>;
}

const NewSlide: React.FC<NewSlideProps> = ({ params }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [projectId, setProjectId] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectWithSlides | null>(null);
  const [formData, setFormData] = useState({
    order: 1,
    type: 'image' as SlideType,
    text: '',
  });
  
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setProjectId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/dashboard/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load project data
  useEffect(() => {
    if (!isAuthenticated || !projectId) return;

    const loadProject = async () => {
      console.log('📋 Loading project for slide creation:', projectId);
      
      try {
        setLoadingProject(true);
        const projectData = await projectsAPI.getById(projectId);
        setProject(projectData);
        
        // Set default order to be next in sequence
        const maxOrder = projectData.slides.length > 0 
          ? Math.max(...projectData.slides.map(s => s.order))
          : 0;
        setFormData(prev => ({ ...prev, order: maxOrder + 1 }));
        
        console.log('✅ Project loaded successfully:', projectData.name);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load project';
        console.error('❌ Error loading project:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoadingProject(false);
      }
    };

    loadProject();
  }, [isAuthenticated, projectId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'order' ? parseInt(value) || 1 : value 
    }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Auto-detect slide type based on file
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, type: 'image' }));
      } else if (file.type.startsWith('video/')) {
        // For videos, default to horizontal (user can change if needed)
        setFormData(prev => ({ ...prev, type: 'horizontal' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🎬 Creating new slide for project:', projectId);
    
    if (!mediaFile) {
      setError('Media file is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const slide = await slidesAPI.create({
        projectId: projectId!,
        order: formData.order,
        type: formData.type,
        text: formData.text || undefined,
        mediaFile
      });

      console.log('🎉 Slide created successfully:', slide.id);
      router.push(`/dashboard/projects/${projectId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create slide';
      console.error('❌ Error creating slide:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loadingProject) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-glass-fill backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/dashboard/projects/${projectId}`)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="font-new-black text-2xl font-light">
                Add <span className="font-medium">New Slide</span>
              </h1>
              <p className="text-gray-400 text-sm">
                {project?.name} • Slide {formData.order}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Slide Settings */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Slide Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-2">
                  Slide Order *
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current slides: {project?.slides.length || 0}
                </p>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                  Slide Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {slideTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type === 'image' && 'Square/portrait layout for images'}
                  {formData.type === 'horizontal' && '16:9 video layout for motion graphics'}
                  {formData.type === 'vertical' && '9:16 reel format for social media'}
                </p>
              </div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Slide Content</h2>
            
            <div className="space-y-6">
              {/* Media File */}
              <div>
                <label htmlFor="mediaFile" className="block text-sm font-medium text-gray-300 mb-2">
                  Media File * {formData.type === 'image' ? '(Image)' : '(Video)'}
                </label>
                <input
                  type="file"
                  id="mediaFile"
                  accept={formData.type === 'image' ? 'image/*' : 'video/*,image/*'}
                  onChange={handleMediaChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  required
                />
                
                {mediaPreview && (
                  <div className="mt-4">
                    {mediaFile?.type.startsWith('image/') ? (
                      <img
                        src={mediaPreview}
                        alt="Media preview"
                        className="max-w-xs max-h-48 rounded-lg border border-gray-600"
                      />
                    ) : (
                      <video
                        src={mediaPreview}
                        className="max-w-xs max-h-48 rounded-lg border border-gray-600"
                        controls
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Slide Text */}
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">
                  Slide Text (Optional)
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter descriptive text for this slide"
                />
              </div>
            </div>
          </div>

          {/* Existing Slides Preview */}
          {project && project.slides.length > 0 && (
            <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-medium mb-6">Existing Slides</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.slides
                  .sort((a, b) => a.order - b.order)
                  .map((slide) => (
                    <div
                      key={slide.id}
                      className="bg-black/30 rounded-lg p-3 border border-white/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">#{slide.order}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          slide.type === 'image' ? 'bg-green-600/20 text-green-400' :
                          slide.type === 'horizontal' ? 'bg-blue-600/20 text-blue-400' :
                          'bg-purple-600/20 text-purple-400'
                        }`}>
                          {slide.type}
                        </span>
                      </div>
                      {slide.text && (
                        <p className="text-gray-400 text-xs line-clamp-2">{slide.text}</p>
                      )}
                    </div>
                  ))}
                
                {/* New slide preview */}
                <div className="bg-blue-600/20 border-2 border-dashed border-blue-500 rounded-lg p-3 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-blue-400 text-sm font-medium">#{formData.order}</span>
                    <p className="text-blue-400 text-xs mt-1">New Slide</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push(`/dashboard/projects/${projectId}`)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !mediaFile}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Slide'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSlide;
