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
