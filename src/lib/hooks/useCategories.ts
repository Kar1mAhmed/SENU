// Hook for fetching and managing categories
import { useState, useEffect, useCallback } from 'react';
import { categoriesAPI } from '../api-client';
import { Category } from '../types';

console.log('🏷️ useCategories hook loaded - ready to fetch dynamic categories!');

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        console.log('📋 Fetching categories from API...');
        
        try {
            setLoading(true);
            setError(null);
            
            const data = await categoriesAPI.getAll();
            setCategories(data);
            
            console.log(`✅ Fetched ${data.length} categories successfully`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
            console.error('❌ Error fetching categories:', errorMessage);
            setError(errorMessage);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const createCategory = useCallback(async (name: string, displayOrder?: number) => {
        console.log('🆕 Creating category:', name);
        
        try {
            const newCategory = await categoriesAPI.create({ name, displayOrder });
            setCategories(prev => [...prev, newCategory].sort((a, b) => a.displayOrder - b.displayOrder));
            console.log('✅ Category created successfully:', newCategory.name);
            return newCategory;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
            console.error('❌ Error creating category:', errorMessage);
            throw err;
        }
    }, []);

    const updateCategory = useCallback(async (id: number, data: { name?: string; displayOrder?: number }) => {
        console.log('✏️ Updating category:', id);
        
        try {
            const updatedCategory = await categoriesAPI.update(id, data);
            setCategories(prev => 
                prev.map(cat => cat.id === id ? updatedCategory : cat)
                    .sort((a, b) => a.displayOrder - b.displayOrder)
            );
            console.log('✅ Category updated successfully:', updatedCategory.name);
            return updatedCategory;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
            console.error('❌ Error updating category:', errorMessage);
            throw err;
        }
    }, []);

    const deleteCategory = useCallback(async (id: number) => {
        console.log('🗑️ Deleting category:', id);
        
        try {
            await categoriesAPI.delete(id);
            setCategories(prev => prev.filter(cat => cat.id !== id));
            console.log('✅ Category deleted successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
            console.error('❌ Error deleting category:', errorMessage);
            throw err;
        }
    }, []);

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory
    };
}
