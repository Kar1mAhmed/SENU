// New project creation page
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCategories } from '@/lib/hooks/useCategories';
import { projectsAPI } from '@/lib/api-client';
import { ProjectType, ProjectExtraField } from '@/lib/types';

console.log('🆕 New project page loaded - ready to create projects like a digital architect!');

const projectTypes: ProjectType[] = ['image', 'horizontal', 'vertical'];

// Utility function for formatting bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

const NewProject: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    clientName: '',
    tags: [] as string[],
    categoryId: 0,
    projectType: 'image' as ProjectType,
    dateFinished: '',
    extraFields: [] as ProjectExtraField[],
  });

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && formData.categoryId === 0) {
      setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, formData.categoryId]);

  const [tagInput, setTagInput] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [clientLogoFile, setClientLogoFile] = useState<File | null>(null);
  const [clientLogoPreview, setClientLogoPreview] = useState<string | null>(null);
  const [iconBarBgColor, setIconBarBgColor] = useState('#4FAF78');
  const [iconBarIconColor, setIconBarIconColor] = useState('#FFFFFF');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ loaded: number; total: number; percentage: number } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/dashboard/login');
    }
  }, [isAuthenticated, authLoading, router]);

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
    console.log('📝 Creating new project:', formData.name);

    if (!thumbnailFile) {
      setError('Thumbnail image is required');
      return;
    }

    if (!clientLogoFile) {
      setError('Client logo is required');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(null);

    try {
      const response = await projectsAPI.create(
        {
          name: formData.name,
          title: formData.title,
          description: formData.description,
          clientName: formData.clientName,
          tags: formData.tags,
          categoryId: formData.categoryId,
          projectType: formData.projectType,
          dateFinished: formData.dateFinished,
          extraFields: formData.extraFields,
          thumbnailFile: thumbnailFile!,
          clientLogoFile: clientLogoFile || undefined,
          iconBarBgColor,
          iconBarIconColor
        },
        (progress) => {
          console.log(`📊 Upload progress: ${progress.percentage}%`);
          setUploadProgress(progress);
        }
      );

      console.log('🎉 Project created successfully:', response.id);
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      console.error('❌ Error creating project:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  if (authLoading) {
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
                Create <span className="font-medium">New Project</span>
              </h1>
              <p className="text-gray-400 text-sm">Add a new project to your portfolio</p>
            </div>
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
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                {categoriesLoading ? (
                  <div className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-gray-400">
                    Loading categories...
                  </div>
                ) : (
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                )}
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
                No extra fields added. Click "Add Field" to add project information like client, timeline, service, etc.
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
            <h2 className="text-xl font-medium mb-6">Client Logo *</h2>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleClientLogoChange}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                required
              />

              {clientLogoPreview && (
                <div className="mt-4">
                  <img
                    src={clientLogoPreview}
                    alt="Client logo preview"
                    className="max-w-24 max-h-24 rounded-lg border border-gray-600 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Thumbnail Image *</h2>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                required
              />

              {thumbnailPreview && (
                <div className="mt-4">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="max-w-xs max-h-48 rounded-lg border border-gray-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Icon Bar Colors */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Icon Bar Colors 🎨</h2>
            <p className="text-sm text-gray-400 mb-6">Customize the icon bar colors for this project</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Background Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Background Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={iconBarBgColor}
                    onChange={(e) => setIconBarBgColor(e.target.value)}
                    className="h-12 w-20 rounded-lg cursor-pointer border-2 border-gray-600"
                  />
                  <input
                    type="text"
                    value={iconBarBgColor}
                    onChange={(e) => setIconBarBgColor(e.target.value)}
                    placeholder="#4FAF78"
                    className="flex-1 px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div 
                  className="mt-3 h-12 rounded-lg border border-gray-600 flex items-center justify-center text-sm"
                  style={{ backgroundColor: iconBarBgColor }}
                >
                  <span style={{ color: iconBarIconColor }}>Preview</span>
                </div>
              </div>

              {/* Icon Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Icon Color
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={iconBarIconColor}
                    onChange={(e) => setIconBarIconColor(e.target.value)}
                    className="h-12 w-20 rounded-lg cursor-pointer border-2 border-gray-600"
                  />
                  <input
                    type="text"
                    value={iconBarIconColor}
                    onChange={(e) => setIconBarIconColor(e.target.value)}
                    placeholder="#FFFFFF"
                    className="flex-1 px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div 
                  className="mt-3 h-12 rounded-lg border border-gray-600 flex items-center justify-center text-sm"
                  style={{ backgroundColor: iconBarBgColor }}
                >
                  <span style={{ color: iconBarIconColor }}>★ ♥ ✦</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  <span className="text-blue-400 font-medium">
                    Uploading files...
                  </span>
                </div>
                <span className="text-blue-400 font-bold">{uploadProgress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {formatBytes(uploadProgress.loaded)} / {formatBytes(uploadProgress.total)}
              </div>
              {uploadProgress.percentage < 100 && (
                <p className="mt-2 text-xs text-yellow-400">
                  ⚠️ Please keep this page open until upload completes
                </p>
              )}
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
              disabled={loading || !formData.name || !formData.title || !formData.clientName || !thumbnailFile}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
