// Project editing page
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { projectsAPI } from '@/lib/api-client';
import { ProjectWithSlides, ProjectCategory, ProjectType, ProjectExtraField } from '@/lib/types';

export const runtime = 'edge';

console.log('✏️ Edit project page loaded - ready to modify projects like a digital editor!');

const categories: ProjectCategory[] = [
  'Branding',
  'Logo design', 
  'UI/UX',
  'Products',
  'Prints',
  'Motions',
  'Shorts'
];

const projectTypes: ProjectType[] = ['image', 'horizontal', 'vertical'];

interface EditProjectProps {
  params: Promise<{ id: string }>;
}

const EditProject: React.FC<EditProjectProps> = ({ params }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [projectId, setProjectId] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectWithSlides | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    clientName: '',
    tags: [] as string[],
    category: 'Branding' as ProjectCategory,
    projectType: 'image' as ProjectType,
    dateFinished: '',
    extraFields: [] as ProjectExtraField[],
  });
  
  const [tagInput, setTagInput] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [clientLogoFile, setClientLogoFile] = useState<File | null>(null);
  const [clientLogoPreview, setClientLogoPreview] = useState<string | null>(null);
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
      console.log('📋 Loading project:', projectId);
      
      try {
        setLoadingProject(true);
        const projectData = await projectsAPI.getById(projectId);
        setProject(projectData);
        
        // Populate form with project data
        setFormData({
          name: projectData.name,
          title: projectData.title,
          description: projectData.description || '',
          clientName: projectData.client,
          tags: projectData.tags,
          category: projectData.category,
          projectType: projectData.type,
          dateFinished: projectData.dateFinished ? 
            (projectData.dateFinished instanceof Date ? 
              projectData.dateFinished.toISOString().split('T')[0] : 
              new Date(projectData.dateFinished).toISOString().split('T')[0]
            ) : '',
          extraFields: projectData.extraFields || [],
        });
        
        // Set image previews using keys
        if (projectData.thumbnailKey) {
          setThumbnailPreview(`/api/media/${projectData.thumbnailKey}`);
        }
        if (projectData.clientLogoKey) {
          setClientLogoPreview(`/api/media/${projectData.clientLogoKey}`);
        }
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClientLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setClientLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setClientLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addExtraField = () => {
    if (formData.extraFields.length < 4) {
      setFormData(prev => ({
        ...prev,
        extraFields: [...prev.extraFields, { name: '', value: '', url: '' }]
      }));
    }
  };

  const updateExtraField = (index: number, field: 'name' | 'value' | 'url', newValue: string) => {
    setFormData(prev => ({
      ...prev,
      extraFields: prev.extraFields.map((item, i) => 
        i === index ? { ...item, [field]: newValue } : item
      )
    }));
  };

  const removeExtraField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      extraFields: prev.extraFields.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('💾 Updating project:', projectId);
    
    setLoading(true);
    setError(null);

    try {
      const updatedProject = await projectsAPI.update(projectId!, {
        ...formData,
        thumbnailFile: thumbnailFile || undefined,
        clientLogoFile: clientLogoFile || undefined
      });

      console.log('🎉 Project updated successfully:', updatedProject.id);
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      console.error('❌ Error updating project:', errorMessage);
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
          <p>Loading project...</p>
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
              onClick={() => router.push('/dashboard')}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="font-new-black text-2xl font-light">
                Edit <span className="font-medium">Project</span>
              </h1>
              <p className="text-gray-400 text-sm">
                {project?.name} • {project?.slides.length || 0} slides
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/dashboard/projects/${projectId}/slides/new`)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Slide
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-300 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div>
                <label htmlFor="dateFinished" className="block text-sm font-medium text-gray-300 mb-2">
                  Date Finished
                </label>
                <input
                  type="date"
                  id="dateFinished"
                  name="dateFinished"
                  value={formData.dateFinished}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter project description"
              />
            </div>
          </div>

          {/* Project Settings */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Project Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type *
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {projectTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Tags</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Extra Fields */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Project Information Fields</h2>
              <button
                type="button"
                onClick={addExtraField}
                disabled={formData.extraFields.length >= 4}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
              >
                Add Field ({formData.extraFields.length}/4)
              </button>
            </div>

            {formData.extraFields.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No extra fields added. Click &quot;Add Field&quot; to add project information like client, timeline, service, etc.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.extraFields.map((field, index) => (
                  <div key={index} className="p-4 bg-black/30 rounded-lg border border-gray-700 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Field Name
                        </label>
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => updateExtraField(index, 'name', e.target.value)}
                          className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., CLIENT, TIMELINE, SERVICE, WEBSITE"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Field Value
                        </label>
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => updateExtraField(index, 'value', e.target.value)}
                          className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., INVISION STUDIO, 4 WEEKS, GOLA.IO"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Link URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={field.url || ''}
                          onChange={(e) => updateExtraField(index, 'url', e.target.value)}
                          className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com (makes the field clickable)"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeExtraField(index)}
                          className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition-colors duration-200"
                          title="Remove field"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Logo */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Client Logo</h2>
            
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleClientLogoChange}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              
              {clientLogoPreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Current client logo:</p>
                  <Image
                    src={clientLogoPreview}
                    alt="Client logo preview"
                    width={96}
                    height={96}
                    className="max-w-24 max-h-24 rounded-lg border border-gray-600 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Thumbnail Image</h2>
            
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              
              {thumbnailPreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">
                    {thumbnailFile ? 'New thumbnail preview:' : 'Current thumbnail:'}
                  </p>
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    width={320}
                    height={192}
                    className="max-w-xs max-h-48 rounded-lg border border-gray-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Project Slides */}
          {project && project.slides.length > 0 && (
            <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Project Slides ({project.slides.length})</h2>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/projects/${projectId}/slides/new`)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Slide
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.slides.map((slide) => (
                  <div
                    key={slide.id}
                    className="bg-black/30 rounded-lg p-4 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Slide {slide.order}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        slide.type === 'image' ? 'bg-green-600/20 text-green-400' :
                        slide.type === 'horizontal' ? 'bg-blue-600/20 text-blue-400' :
                        'bg-purple-600/20 text-purple-400'
                      }`}>
                        {slide.type}
                      </span>
                    </div>
                    {slide.text && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{slide.text}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => router.push(`/dashboard/projects/${projectId}/slides/${slide.id}`)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-xs font-medium transition-colors duration-200"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
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
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.title || !formData.clientName}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
