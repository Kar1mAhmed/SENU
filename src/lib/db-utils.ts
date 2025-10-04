// Database utility functions for type-safe operations
import {
    DBProject,
    DBSlide,
    DBCategory,
    Category,
    ProjectWithSlides,
    ProjectSlide,
    ProjectExtraField,
    D1Database,
    ProjectType,
    SlideType
} from './types';

console.log('🗄️ Database utilities loaded - ready to handle data like a boss!');

// Convert database category to frontend format
export function dbCategoryToCategory(dbCategory: DBCategory): Category {
    return {
        id: dbCategory.id,
        name: dbCategory.name,
        displayOrder: dbCategory.display_order,
        createdAt: new Date(dbCategory.created_at),
        updatedAt: new Date(dbCategory.updated_at)
    };
}

// Convert database project to frontend format
export function dbProjectToProject(dbProject: DBProject): ProjectWithSlides {
    console.log('🔄 Converting DB project to frontend format:', dbProject.name);

    // Parse extra fields from JSON string
    let extraFields: ProjectExtraField[] = [];
    try {
        extraFields = JSON.parse(dbProject.extra_fields || '[]');
    } catch (error) {
        console.log('⚠️ Failed to parse extra fields for project:', dbProject.name, error);
        extraFields = [];
    }

    return {
        id: dbProject.id,
        name: dbProject.name,
        title: dbProject.title,
        description: dbProject.description,
        client: dbProject.client_name,
        clientLogoKey: dbProject.client_logo_key,
        tags: JSON.parse(dbProject.tags || '[]'),
        category: dbProject.category, // Legacy field for display
        categoryId: dbProject.category_id, // New field for database operations
        type: dbProject.project_type,
        dateFinished: dbProject.date_finished ? new Date(dbProject.date_finished) : undefined,
        thumbnailKey: dbProject.thumbnail_key,
        extraFields,
        iconBarBgColor: dbProject.icon_bar_bg_color,
        iconBarIconColor: dbProject.icon_bar_icon_color,
        displayOrderInCategory: dbProject.display_order_in_category || 0,
        displayOrderGlobal: dbProject.display_order_global || 0,
        slides: [], // Will be populated separately
        createdAt: new Date(dbProject.created_at),
        updatedAt: new Date(dbProject.updated_at)
    };
}

// Convert database slide to frontend format
export function dbSlideToSlide(dbSlide: DBSlide): ProjectSlide {
    return {
        id: dbSlide.id,
        projectId: dbSlide.project_id,
        order: dbSlide.slide_order,
        type: dbSlide.slide_type,
        text: dbSlide.slide_text,
        mediaKey: dbSlide.media_key,
        createdAt: new Date(dbSlide.created_at),
        updatedAt: new Date(dbSlide.updated_at)
    };
}

// Generate unique ID
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Project database operations
export class ProjectDB {
    constructor(private db: D1Database) { }

    async create(data: {
        name: string;
        title: string;
        description?: string;
        clientName: string;
        clientLogoKey?: string;
        tags: string[];
        categoryId: number;
        projectType: ProjectType;
        dateFinished?: string;
        extraFields?: ProjectExtraField[];
        thumbnailKey?: string;
        iconBarBgColor?: string;
        iconBarIconColor?: string;
    }): Promise<DBProject> {
        console.log('🚀 Creating new project in DB:', data.name);

        const id = generateId();
        const now = new Date().toISOString();

        // Get category name for legacy field
        const categoryResult = await this.db.prepare('SELECT name FROM categories WHERE id = ?')
            .bind(data.categoryId).first<{ name: string }>();
        const categoryName = categoryResult?.name || 'Branding';

        // Get max display orders for initialization
        const maxCategoryOrder = await this.db.prepare(
            'SELECT MAX(display_order_in_category) as max_order FROM projects WHERE category_id = ?'
        ).bind(data.categoryId).first<{ max_order: number | null }>();
        
        const maxGlobalOrder = await this.db.prepare(
            'SELECT MAX(display_order_global) as max_order FROM projects'
        ).first<{ max_order: number | null }>();

        const displayOrderInCategory = (maxCategoryOrder?.max_order || 0) + 1;
        const displayOrderGlobal = (maxGlobalOrder?.max_order || 0) + 1;

        const stmt = this.db.prepare(`
      INSERT INTO projects (
        id, name, title, description, client_name, client_logo_key, tags, 
        category, category_id, project_type, date_finished, extra_fields, thumbnail_key, 
        icon_bar_bg_color, icon_bar_icon_color, display_order_in_category, display_order_global,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        await stmt.bind(
            id,
            data.name,
            data.title,
            data.description || null,
            data.clientName,
            data.clientLogoKey || null,
            JSON.stringify(data.tags),
            categoryName,
            data.categoryId,
            data.projectType,
            data.dateFinished || null,
            JSON.stringify(data.extraFields || []),
            data.thumbnailKey || null,
            data.iconBarBgColor || '#4FAF78',
            data.iconBarIconColor || '#FFFFFF',
            displayOrderInCategory,
            displayOrderGlobal,
            now,
            now
        ).run();

        console.log('✅ Project created successfully with ID:', id);
        return this.getById(id);
    }

    async getById(id: string): Promise<DBProject> {
        console.log('🔍 Fetching project by ID:', id);

        const stmt = this.db.prepare('SELECT * FROM projects WHERE id = ?');
        const result = await stmt.bind(id).first<DBProject>();

        if (!result) {
            throw new Error(`Project with ID ${id} not found`);
        }

        console.log('📦 Project found:', result.name);
        return result;
    }

    async getAll(options: {
        categoryId?: number;
        limit?: number;
        offset?: number;
    } = {}): Promise<{ projects: DBProject[]; total: number }> {
        console.log('📋 Fetching projects with options:', JSON.stringify(options).substring(0, 100));

        let query = 'SELECT * FROM projects';
        let countQuery = 'SELECT COUNT(*) as count FROM projects';
        const bindings: unknown[] = [];

        if (options.categoryId) {
            query += ' WHERE category_id = ?';
            countQuery += ' WHERE category_id = ?';
            bindings.push(options.categoryId);
        }

        // Sort by display order (category-specific if filtered, global if not)
        if (options.categoryId) {
            query += ' ORDER BY display_order_in_category ASC';
        } else {
            query += ' ORDER BY display_order_global ASC';
        }

        if (options.limit) {
            query += ' LIMIT ?';
            bindings.push(options.limit);

            if (options.offset) {
                query += ' OFFSET ?';
                bindings.push(options.offset);
            }
        }

        const [projectsResult, countResult] = await Promise.all([
            this.db.prepare(query).bind(...bindings).all<DBProject>(),
            this.db.prepare(countQuery).bind(...(options.categoryId ? [options.categoryId] : [])).first<{ count: number }>()
        ]);

        console.log(`📊 Found ${projectsResult.results?.length || 0} projects out of ${countResult?.count || 0} total`);

        return {
            projects: projectsResult.results || [],
            total: countResult?.count || 0
        };
    }

    async update(id: string, data: Partial<{
        name: string;
        title: string;
        description?: string;
        clientName: string;
        clientLogoKey?: string;
        tags: string[];
        categoryId: number;
        projectType: ProjectType;
        dateFinished?: string;
        extraFields?: ProjectExtraField[];
        thumbnailKey?: string;
        iconBarBgColor?: string;
        iconBarIconColor?: string;
    }>): Promise<DBProject> {
        console.log('✏️ Updating project:', id, 'with data keys:', Object.keys(data).join(', '));

        const updates: string[] = [];
        const bindings: unknown[] = [];

        if (data.name !== undefined) {
            updates.push('name = ?');
            bindings.push(data.name);
        }
        if (data.title !== undefined) {
            updates.push('title = ?');
            bindings.push(data.title);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            bindings.push(data.description);
        }
        if (data.clientName !== undefined) {
            updates.push('client_name = ?');
            bindings.push(data.clientName);
        }
        if (data.clientLogoKey !== undefined) {
            updates.push('client_logo_key = ?');
            bindings.push(data.clientLogoKey);
        }
        if (data.tags !== undefined) {
            updates.push('tags = ?');
            bindings.push(JSON.stringify(data.tags));
        }
        if (data.extraFields !== undefined) {
            updates.push('extra_fields = ?');
            bindings.push(JSON.stringify(data.extraFields));
        }
        if (data.categoryId !== undefined) {
            // Get category name for legacy field
            const categoryResult = await this.db.prepare('SELECT name FROM categories WHERE id = ?')
                .bind(data.categoryId).first<{ name: string }>();
            const categoryName = categoryResult?.name || 'Branding';
            
            updates.push('category = ?');
            bindings.push(categoryName);
            updates.push('category_id = ?');
            bindings.push(data.categoryId);
        }
        if (data.projectType !== undefined) {
            updates.push('project_type = ?');
            bindings.push(data.projectType);
        }
        if (data.dateFinished !== undefined) {
            updates.push('date_finished = ?');
            bindings.push(data.dateFinished);
        }
        if (data.thumbnailKey !== undefined) {
            updates.push('thumbnail_key = ?');
            bindings.push(data.thumbnailKey);
        }
        if (data.iconBarBgColor !== undefined) {
            updates.push('icon_bar_bg_color = ?');
            bindings.push(data.iconBarBgColor);
        }
        if (data.iconBarIconColor !== undefined) {
            updates.push('icon_bar_icon_color = ?');
            bindings.push(data.iconBarIconColor);
        }

        if (updates.length === 0) {
            console.log('⚠️ No updates provided for project:', id);
            return this.getById(id);
        }

        updates.push('updated_at = ?');
        bindings.push(new Date().toISOString());
        bindings.push(id);

        const query = `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`;
        await this.db.prepare(query).bind(...bindings).run();

        console.log('✅ Project updated successfully:', id);
        return this.getById(id);
    }

    async delete(id: string): Promise<void> {
        console.log('🗑️ Deleting project:', id);

        const stmt = this.db.prepare('DELETE FROM projects WHERE id = ?');
        await stmt.bind(id).run();

        console.log('✅ Project deleted successfully:', id);
    }

    async reorder(projectId: string, direction: 'up' | 'down', categoryId: number | null): Promise<void> {
        console.log('🔄 Reordering project:', projectId, direction, 'in category:', categoryId);

        // Get the current project
        const currentProject = await this.getById(projectId);
        
        // Determine which order field to use
        const isGlobal = categoryId === null;
        const orderField = isGlobal ? 'display_order_global' : 'display_order_in_category';
        const currentOrder = isGlobal ? currentProject.display_order_global : currentProject.display_order_in_category;

        // Find the adjacent project to swap with
        let adjacentQuery: string;
        if (direction === 'up') {
            // Moving up means decreasing order number (swap with previous)
            adjacentQuery = isGlobal
                ? `SELECT * FROM projects WHERE ${orderField} < ? ORDER BY ${orderField} DESC LIMIT 1`
                : `SELECT * FROM projects WHERE category_id = ? AND ${orderField} < ? ORDER BY ${orderField} DESC LIMIT 1`;
        } else {
            // Moving down means increasing order number (swap with next)
            adjacentQuery = isGlobal
                ? `SELECT * FROM projects WHERE ${orderField} > ? ORDER BY ${orderField} ASC LIMIT 1`
                : `SELECT * FROM projects WHERE category_id = ? AND ${orderField} > ? ORDER BY ${orderField} ASC LIMIT 1`;
        }

        const adjacentProject = isGlobal
            ? await this.db.prepare(adjacentQuery).bind(currentOrder).first<DBProject>()
            : await this.db.prepare(adjacentQuery).bind(categoryId, currentOrder).first<DBProject>();

        if (!adjacentProject) {
            console.log('⚠️ No adjacent project found, already at boundary');
            return;
        }

        const adjacentOrder = isGlobal ? adjacentProject.display_order_global : adjacentProject.display_order_in_category;

        // Swap the display orders
        await this.db.prepare(`UPDATE projects SET ${orderField} = ? WHERE id = ?`)
            .bind(adjacentOrder, projectId).run();
        
        await this.db.prepare(`UPDATE projects SET ${orderField} = ? WHERE id = ?`)
            .bind(currentOrder, adjacentProject.id).run();

        console.log('✅ Projects reordered successfully');
    }
}

// Slide database operations
export class SlideDB {
    constructor(private db: D1Database) { }

    async create(data: {
        projectId: string;
        order: number;
        type: SlideType;
        text?: string;
        mediaKey: string;
    }): Promise<DBSlide> {
        console.log('🎬 Creating new slide for project:', data.projectId);

        const id = generateId();
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
      INSERT INTO project_slides (
        id, project_id, slide_order, slide_type, slide_text, media_key, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

        await stmt.bind(
            id,
            data.projectId,
            data.order,
            data.type,
            data.text || null,
            data.mediaKey,
            now,
            now
        ).run();

        console.log('✅ Slide created successfully with ID:', id);
        return this.getById(id);
    }

    async getById(id: string): Promise<DBSlide> {
        console.log('🔍 Fetching slide by ID:', id);

        const stmt = this.db.prepare('SELECT * FROM project_slides WHERE id = ?');
        const result = await stmt.bind(id).first<DBSlide>();

        if (!result) {
            throw new Error(`Slide with ID ${id} not found`);
        }

        return result;
    }

    async getByProjectId(projectId: string): Promise<DBSlide[]> {
        console.log('📋 Fetching slides for project:', projectId);

        const stmt = this.db.prepare('SELECT * FROM project_slides WHERE project_id = ? ORDER BY slide_order ASC');
        const result = await stmt.bind(projectId).all<DBSlide>();

        console.log(`📊 Found ${result.results?.length || 0} slides for project:`, projectId);
        return result.results || [];
    }

    async update(id: string, data: Partial<{
        order: number;
        type: SlideType;
        text?: string;
        mediaKey: string;
    }>): Promise<DBSlide> {
        console.log('✏️ Updating slide:', id);

        const updates: string[] = [];
        const bindings: unknown[] = [];

        if (data.order !== undefined) {
            updates.push('slide_order = ?');
            bindings.push(data.order);
        }
        if (data.type !== undefined) {
            updates.push('slide_type = ?');
            bindings.push(data.type);
        }
        if (data.text !== undefined) {
            updates.push('slide_text = ?');
            bindings.push(data.text);
        }
        if (data.mediaKey !== undefined) {
            updates.push('media_key = ?');
            bindings.push(data.mediaKey);
        }

        if (updates.length === 0) {
            return this.getById(id);
        }

        updates.push('updated_at = ?');
        bindings.push(new Date().toISOString());
        bindings.push(id);

        const query = `UPDATE project_slides SET ${updates.join(', ')} WHERE id = ?`;
        await this.db.prepare(query).bind(...bindings).run();

        console.log('✅ Slide updated successfully:', id);
        return this.getById(id);
    }

    async delete(id: string): Promise<void> {
        console.log('🗑️ Deleting slide:', id);

        const stmt = this.db.prepare('DELETE FROM project_slides WHERE id = ?');
        await stmt.bind(id).run();

        console.log('✅ Slide deleted successfully:', id);
    }

    async deleteByProjectId(projectId: string): Promise<void> {
        console.log('🗑️ Deleting all slides for project:', projectId);

        const stmt = this.db.prepare('DELETE FROM project_slides WHERE project_id = ?');
        await stmt.bind(projectId).run();

        console.log('✅ All slides deleted for project:', projectId);
    }
}

// Category database operations
export class CategoryDB {
    constructor(private db: D1Database) { }

    async create(data: {
        name: string;
        displayOrder?: number;
    }): Promise<DBCategory> {
        console.log('🏷️ Creating new category:', data.name);

        const now = new Date().toISOString();
        
        // Get the max display order if not provided
        let displayOrder = data.displayOrder;
        if (displayOrder === undefined) {
            const maxOrderResult = await this.db.prepare('SELECT MAX(display_order) as max_order FROM categories')
                .first<{ max_order: number | null }>();
            displayOrder = (maxOrderResult?.max_order || 0) + 1;
        }

        const stmt = this.db.prepare(`
            INSERT INTO categories (name, display_order, created_at, updated_at)
            VALUES (?, ?, ?, ?)
        `);

        const result = await stmt.bind(
            data.name,
            displayOrder,
            now,
            now
        ).run();

        console.log('✅ Category created successfully');
        
        // Get the created category
        const created = await this.db.prepare('SELECT * FROM categories WHERE name = ?')
            .bind(data.name).first<DBCategory>();
        
        if (!created) {
            throw new Error('Failed to retrieve created category');
        }
        
        return created;
    }

    async getById(id: number): Promise<DBCategory> {
        console.log('🔍 Fetching category by ID:', id);

        const stmt = this.db.prepare('SELECT * FROM categories WHERE id = ?');
        const result = await stmt.bind(id).first<DBCategory>();

        if (!result) {
            throw new Error(`Category with ID ${id} not found`);
        }

        console.log('📦 Category found:', result.name);
        return result;
    }

    async getAll(): Promise<DBCategory[]> {
        console.log('📋 Fetching all categories');

        const stmt = this.db.prepare('SELECT * FROM categories ORDER BY display_order ASC');
        const result = await stmt.all<DBCategory>();

        console.log(`📊 Found ${result.results?.length || 0} categories`);
        return result.results || [];
    }

    async update(id: number, data: Partial<{
        name: string;
        displayOrder: number;
    }>): Promise<DBCategory> {
        console.log('✏️ Updating category:', id);

        const updates: string[] = [];
        const bindings: unknown[] = [];

        if (data.name !== undefined) {
            updates.push('name = ?');
            bindings.push(data.name);
        }
        if (data.displayOrder !== undefined) {
            updates.push('display_order = ?');
            bindings.push(data.displayOrder);
        }

        if (updates.length === 0) {
            console.log('⚠️ No updates provided for category:', id);
            return this.getById(id);
        }

        updates.push('updated_at = ?');
        bindings.push(new Date().toISOString());
        bindings.push(id);

        const query = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`;
        await this.db.prepare(query).bind(...bindings).run();

        console.log('✅ Category updated successfully:', id);
        return this.getById(id);
    }

    async delete(id: number): Promise<void> {
        console.log('🗑️ Deleting category:', id);

        // Check if any projects are using this category
        const projectCount = await this.db.prepare('SELECT COUNT(*) as count FROM projects WHERE category_id = ?')
            .bind(id).first<{ count: number }>();

        if (projectCount && projectCount.count > 0) {
            throw new Error(`Cannot delete category: ${projectCount.count} projects are using it`);
        }

        const stmt = this.db.prepare('DELETE FROM categories WHERE id = ?');
        await stmt.bind(id).run();

        console.log('✅ Category deleted successfully:', id);
    }
}
