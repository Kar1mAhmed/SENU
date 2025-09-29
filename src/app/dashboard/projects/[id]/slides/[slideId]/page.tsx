// Edit slide page
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { slidesAPI } from '@/lib/api-client';
import { ProjectSlide, SlideType } from '@/lib/types';

console.log('✏️ Edit slide page loaded - ready to update slide content!');

const slideTypes: SlideType[] = ['image', 'horizontal', 'vertical'];

const EditSlide: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [projectId, setProjectId] = useState<string>('');
  const [slideId, setSlideId] = useState<string>('');

  const [formData, setFormData] = useState({
    order: 0,
    type: 'image' as SlideType,
    text: '',
  });

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlide, setLoadingSlide] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setProjectId(resolvedParams.id as string);
      setSlideId(resolvedParams.slideId as string);
    };
    resolveParams();
  }, [params]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/dashboard/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load slide data
  useEffect(() => {
    if (!slideId || !isAuthenticated) return;

    const loadSlide = async () => {
      try {
        setLoadingSlide(true);
        console.log('📋 Loading slide:', slideId);
        
        const slide = await slidesAPI.getById(slideId);
        
        setFormData({
          order: slide.order,
          type: slide.type,
          text: slide.text || '',
        });

        // Set media preview if slide has media
        if (slide.mediaUrl) {
          setMediaPreview(slide.mediaUrl);
        }

        console.log('✅ Slide loaded successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load slide';
        console.error('❌ Error loading slide:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoadingSlide(false);
      }
    };

    loadSlide();
  }, [slideId, isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('✏️ Updating slide:', slideId);

    setLoading(true);
    setError(null);

    try {
      const updateData: any = {
        order: parseInt(formData.order.toString()),
        type: formData.type,
        text: formData.text || undefined,
      };

      if (mediaFile) {
        updateData.mediaFile = mediaFile;
      }

      const slide = await slidesAPI.update(slideId, updateData);

      console.log('🎉 Slide updated successfully:', slide.id);
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update slide';
      console.error('❌ Error updating slide:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loadingSlide) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading slide...</p>
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
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>
          <h1 className="text-xl font-medium">Edit Slide</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Slide Details */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Slide Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slide Type
                </label>
                <select
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
              </div>
            </div>

            {/* Text */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Text (Optional)
              </label>
              <textarea
                name="text"
                value={formData.text}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Optional text description for this slide"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-glass-fill backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-6">Media File</h2>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />

              {mediaPreview && (
                <div className="mt-4">
                  {mediaPreview.includes('video') || mediaFile?.type.startsWith('video') ? (
                    <video
                      src={mediaPreview}
                      className="max-w-xs max-h-48 rounded-lg border border-gray-600"
                      controls
                    />
                  ) : (
                    <img
                      src={mediaPreview}
                      alt="Media preview"
                      className="max-w-xs max-h-48 rounded-lg border border-gray-600 object-contain"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

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
              className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {loading ? 'Updating...' : 'Update Slide'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditSlide;
