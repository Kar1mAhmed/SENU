// Database utility functions for type-safe operations
import {
    DBProject,
    DBSlide,
    ProjectWithSlides,
    ProjectSlide,
    ProjectExtraField,
    D1Database,
    ProjectCategory,
    ProjectType,
    SlideType
} from './types';

console.log('🗄️ Database utilities loaded - ready to handle data like a boss!');

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
        category: dbProject.category,
        type: dbProject.project_type,
        dateFinished: dbProject.date_finished ? new Date(dbProject.date_finished) : undefined,
        thumbnailKey: dbProject.thumbnail_key,
        extraFields,
        iconBarBgColor: dbProject.icon_bar_bg_color,
        iconBarIconColor: dbProject.icon_bar_icon_color,
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
        category: ProjectCategory;
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

        const stmt = this.db.prepare(`
      INSERT INTO projects (
        id, name, title, description, client_name, client_logo_key, tags, 
        category, project_type, date_finished, extra_fields, thumbnail_key, 
        icon_bar_bg_color, icon_bar_icon_color, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        await stmt.bind(
            id,
            data.name,
            data.title,
            data.description || null,
            data.clientName,
            data.clientLogoKey || null,
            JSON.stringify(data.tags),
            data.category,
            data.projectType,
            data.dateFinished || null,
            JSON.stringify(data.extraFields || []),
            data.thumbnailKey || null,
            data.iconBarBgColor || '#4FAF78',
            data.iconBarIconColor || '#FFFFFF',
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
        category?: ProjectCategory;
        limit?: number;
        offset?: number;
    } = {}): Promise<{ projects: DBProject[]; total: number }> {
        console.log('📋 Fetching projects with options:', JSON.stringify(options).substring(0, 100));

        let query = 'SELECT * FROM projects';
        let countQuery = 'SELECT COUNT(*) as count FROM projects';
        const bindings: unknown[] = [];

        if (options.category) {
            query += ' WHERE category = ?';
            countQuery += ' WHERE category = ?';
            bindings.push(options.category);
        }

        query += ' ORDER BY created_at DESC';

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
            this.db.prepare(countQuery).bind(...(options.category ? [options.category] : [])).first<{ count: number }>()
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
        category: ProjectCategory;
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
        if (data.category !== undefined) {
            updates.push('category = ?');
            bindings.push(data.category);
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
