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
