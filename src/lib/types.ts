export type Service = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  projectsCount: number;
  accentColor: string;
};

export type WithClassName<T = object> = T & {
  className?: string;
};

export type ProjectType = 'image' | 'horizontal' | 'vertical';
export type ProjectCategory = 'Branding' | 'Logo design' | 'UI/UX' | 'Products' | 'Prints' | 'Motions' | 'Shorts';
export type SlideType = 'image' | 'vertical' | 'horizontal';

// Extra field type for project information
export interface ProjectExtraField {
  name: string;
  value: string;
  url?: string; // Optional URL to make the field clickable
};

// Database Project type (matches database schema)
export type DBProject = {
  id: string;
  name: string;
  title: string;
  description?: string;
  client_name: string;
  client_logo_key?: string;
  tags: string; // JSON string in database
  category: ProjectCategory;
  project_type: ProjectType;
  date_finished?: string; // ISO date string
  thumbnail_key?: string;
  extra_fields?: string; // JSON string in database for extra fields
  created_at: string;
  updated_at: string;
};

// Database Slide type (matches database schema)
export type DBSlide = {
  id: string;
  project_id: string;
  slide_order: number;
  slide_type: SlideType;
  slide_text?: string;
  media_key: string;
  created_at: string;
  updated_at: string;
};

// Frontend Project type (for compatibility with existing components)
export type Project = {
  id: string;
  name: string;
  client: string;
  clientLogo?: string;
  work: string[];
  imageUrl: string;
  videoUrl?: string;
  description?: string;
  type: ProjectType;
  category: ProjectCategory;
  thumbnailUrl: string;
};

// Extended project type with slides for detailed view
export type ProjectWithSlides = {
  id: string;
  name: string;
  title: string;
  description?: string;
  client: string;
  clientLogoKey?: string;
  tags: string[];
  category: ProjectCategory;
  type: ProjectType;
  dateFinished?: Date;
  thumbnailKey?: string;
  extraFields: ProjectExtraField[];
  slides: ProjectSlide[];
  createdAt: Date;
  updatedAt: Date;
};

// Slide type for frontend
export type ProjectSlide = {
  id: string;
  projectId: string;
  order: number;
  type: SlideType;
  text?: string;
  mediaKey: string;
  createdAt: Date;
  updatedAt: Date;
};

// API request/response types
export type CreateProjectRequest = {
  name: string;
  title: string;
  description?: string;
  clientName: string;
  clientLogoFile?: File;
  tags: string[];
  category: ProjectCategory;
  projectType: ProjectType;
  dateFinished?: string;
  extraFields?: ProjectExtraField[];
  thumbnailFile?: File;
};

export type UpdateProjectRequest = Partial<CreateProjectRequest> & {
  id: string;
};

export type CreateSlideRequest = {
  projectId: string;
  order: number;
  type: SlideType;
  text?: string;
  mediaFile?: File;
};

export type UpdateSlideRequest = Partial<CreateSlideRequest> & {
  id: string;
};

// API Response types
export type APIResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = APIResponse<{
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}>;

// File upload types
export type FileUploadResponse = {
  url: string;
  key: string;
  size: number;
  contentType: string;
};

// Dashboard auth types
export type DashboardAuth = {
  isAuthenticated: boolean;
  expiresAt: number;
};

// Cloudflare types (basic definitions for our use case)
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta: {
    duration: number;
    size_after: number;
    rows_read: number;
    rows_written: number;
  };
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

export interface R2Bucket {
  put(key: string, value: ReadableStream | ArrayBuffer | string, options?: R2PutOptions): Promise<R2Object | null>;
  get(key: string, options?: R2GetOptions): Promise<R2ObjectBody | null>;
  delete(keys: string | string[]): Promise<void>;
  list(options?: R2ListOptions): Promise<R2Objects>;
}

export interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
}

export interface R2ObjectBody extends R2Object {
  body: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
  blob(): Promise<Blob>;
}

export interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
}

export interface R2GetOptions {
  onlyIf?: R2Conditional;
  range?: R2Range;
}

export interface R2HTTPMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

export interface R2ListOptions {
  limit?: number;
  prefix?: string;
  cursor?: string;
  delimiter?: string;
  startAfter?: string;
  include?: ('httpMetadata' | 'customMetadata')[];
}

export interface R2Objects {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
  delimitedPrefixes: string[];
}

export interface R2Conditional {
  etagMatches?: string;
  etagDoesNotMatch?: string;
  uploadedBefore?: Date;
  uploadedAfter?: Date;
}

export interface R2Range {
  offset?: number;
  length?: number;
  suffix?: number;
}

// Cloudflare environment types
export type CloudflareEnv = {
  DB: D1Database;
  R2: R2Bucket;
  DASHBOARD_USERNAME?: string;
  DASHBOARD_PASSWORD?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  personImage: string;
  backgroundImage: string;
  backgroundColor: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  imageUrl: string;
  backgroundColor: string;
  character: string;
};

export type AboutCard = {
  id: string;
  question: string;
  answer: string;
  imageUrl: string;
  cardBackgroundColor: string;
  sidebarBackgroundColor: string;
  sidebarCharacterColor: string;
  characters: string[];
  gridOpacity: number;
};

export type TeamMember = {
  id: string;
  name: string;
  position: string;
  description: string;
  imageUrl: string;
  characters: string[];
};

export type ContactMethod = 'whatsapp' | 'email' | 'phone';

export type ContactFormData = {
  name: string;
  contactMethod: ContactMethod;
  countryCode?: string;
  phoneNumber?: string;
  email?: string;
  message?: string;
};