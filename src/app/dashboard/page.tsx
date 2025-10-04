// Main dashboard page for project management
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { projectsAPI, slidesAPI } from '@/lib/api-client';
import { useCategories } from '@/lib/hooks/useCategories';
import { ProjectWithSlides, Category } from '@/lib/types';

console.log('📊 Dashboard page loaded - ready to manage projects like a digital project manager!');

const Dashboard: React.FC = () => {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [projects, setProjects] = useState<ProjectWithSlides[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');

  // Fetch categories
  const { categories, loading: categoriesLoading, createCategory, updateCategory, deleteCategory } = useCategories();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('❌ User not authenticated, redirecting to login...');
      router.push('/dashboard/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load projects function
  const loadProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    
    console.log('📋 Loading projects for categoryId:', activeCategoryId);
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectsAPI.getAll({
        categoryId: activeCategoryId || undefined,
        limit: 50
      });
      
      if (response && response.items) {
        setProjects(response.items);
        console.log(`✅ Loaded ${response.items.length} projects`);
      } else {
        console.log('⚠️ No data received from API');
        setProjects([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load projects';
      console.error('❌ Error loading projects:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, activeCategoryId]);

  // Load projects on mount and category change
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      await createCategory(categoryName.trim());
      setCategoryName('');
      setShowCategoryPopup(false);
      console.log('✅ Category created successfully');
    } catch (error) {
      console.error('❌ Error creating category:', error);
      alert('Failed to create category: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      await updateCategory(editingCategory.id, { name: categoryName.trim() });
      setCategoryName('');
      setEditingCategory(null);
      setShowCategoryPopup(false);
      console.log('✅ Category updated successfully');
    } catch (error) {
      console.error('❌ Error updating category:', error);
      alert('Failed to update category: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category? This will fail if any projects are using it.')) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      console.log('✅ Category deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      alert('Failed to delete category: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const openCreatePopup = () => {
    setCategoryName('');
    setEditingCategory(null);
    setShowCategoryPopup(true);
  };

  const openEditPopup = (category: Category) => {
    setCategoryName(category.name);
    setEditingCategory(category);
    setShowCategoryPopup(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    console.log('🗑️ Deleting project:', projectId);
    
    try {
      await projectsAPI.delete(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      console.log('✅ Project deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      console.error('❌ Error deleting project:', errorMessage);
      alert(`Error deleting project: ${errorMessage}`);
    }
  };

  const handleReorderProject = async (projectId: string, direction: 'up' | 'down') => {
    console.log('🔄 Reordering project:', projectId, direction);
    
    try {
      await projectsAPI.reorder(projectId, direction, activeCategoryId);
      // Reload projects to reflect new order
      await loadProjects();
      console.log('✅ Project reordered successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reorder project';
      console.error('❌ Error reordering project:', errorMessage);
      alert(`Error reordering project: ${errorMessage}`);
    }
  };

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProject(prev => prev === projectId ? null : projectId);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-glass-fill backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-new-black text-2xl font-light">
            Dashboard
          </h1>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard/messages')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Messages
            </button>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Category Management */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Categories</h2>
            <button
              onClick={openCreatePopup}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          </div>
          
          {categoriesLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveCategoryId(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  activeCategoryId === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All ({projects.length})
              </button>
              {categories.map((category) => (
                <div key={category.id} className="relative group">
                  <button
                    onClick={() => setActiveCategoryId(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                      activeCategoryId === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                  <div className="absolute -top-2 -right-2 hidden group-hover:flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditPopup(category);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 p-1 rounded-full text-white"
                      title="Edit"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 p-1 rounded-full text-white"
                      title="Delete"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Project Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/projects/new')}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Project
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Projects List */}
        {!loading && !error && (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">No projects found</p>
                <button
                  onClick={() => router.push('/dashboard/projects/new')}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg overflow-hidden"
                >
                  {/* Project Header */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-xl font-medium">{project.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.type === 'image' ? 'bg-green-600/20 text-green-400' :
                            project.type === 'horizontal' ? 'bg-blue-600/20 text-blue-400' :
                            'bg-purple-600/20 text-purple-400'
                          }`}>
                            {project.type}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-600/20 text-gray-400">
                            {categories.find(c => c.id === project.categoryId)?.name || project.category}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{project.title}</p>
                        <p className="text-gray-500 text-sm">
                          Client: {project.client} • {project.slides.length} slides
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Reorder buttons */}
                        <div className="flex flex-col gap-0.5 mr-1">
                          <button
                            onClick={() => handleReorderProject(project.id, 'up')}
                            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors duration-200"
                            title="Move Up"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReorderProject(project.id, 'down')}
                            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors duration-200"
                            title="Move Down"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => toggleProjectExpansion(project.id)}
                          className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          <svg 
                            className={`w-5 h-5 transform transition-transform duration-200 ${
                              expandedProject === project.id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          title="Edit Project"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                          title="Delete Project"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Slides */}
                  {expandedProject === project.id && (
                    <div className="border-t border-white/10 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium">Slides ({project.slides.length})</h4>
                        <button
                          onClick={() => router.push(`/dashboard/projects/${project.id}/slides/new`)}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Slide
                        </button>
                      </div>
                      
                      {project.slides.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No slides yet</p>
                      ) : (
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
                                  onClick={() => router.push(`/dashboard/projects/${project.id}/slides/${slide.id}`)}
                                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-xs font-medium transition-colors duration-200"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Delete this slide?')) {
                                      try {
                                        console.log('🗑️ Deleting slide:', slide.id);
                                        await slidesAPI.delete(slide.id);
                                        console.log('✅ Slide deleted successfully');
                                        // Refresh the projects data
                                        loadProjects();
                                      } catch (error) {
                                        console.error('❌ Error deleting slide:', error);
                                        alert('Failed to delete slide. Please try again.');
                                      }
                                    }
                                  }}
                                  className="px-3 py-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Category Popup */}
      {showCategoryPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCategoryPopup(false)}>
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-medium mb-4">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4 focus:outline-none focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  editingCategory ? handleUpdateCategory() : handleCreateCategory();
                }
              }}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCategoryPopup(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
