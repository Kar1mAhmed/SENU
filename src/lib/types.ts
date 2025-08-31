export type Service = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  projectsCount: number;
  accentColor: string;
};

export type WithClassName<T = {}> = T & {
  className?: string;
};

export type Project = {
  id: string;
  name: string;
  client: string;
  work: string[];
  imageUrl: string;
  category: 'Branding' | 'Logo design' | 'UI/UX' | 'Products' | 'Prints' | 'Motions' | 'Shorts';
};
