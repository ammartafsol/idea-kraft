export type NavItem = { label: string; href: string };

export type SocialLink = { label: string; href: string; handle: string };

export type ImageAsset = {
  src: string;
  alt: string;
};

export type ServiceIconKey =
  | "code"
  | "wordpress"
  | "layers"
  | "refresh"
  | "cart"
  | "target"
  | "brand"
  | "mail"
  | "spark"
  | "cube";

export type Discipline = {
  title: string;
  description: string;
  icon: ServiceIconKey;
  href: string;
  tags: string[];
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: ServiceIconKey;
  offerings: string[];
  approach: { title: string; text: string }[];
  technologies: string[];
  relatedProjects: string[];
};

export type ProjectCategory =
  | "E-commerce"
  | "Web Platform"
  | "Digital Experience"
  | "WordPress"
  | "Branding"
  | "Email";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  year: string;
  client: string;
  role: string[];
  summary: string;
  overview: string;
  challenge: string;
  solution: string;
  approach: { title: string; text: string }[];
  outcomes: string[];
  stack: string[];
  cover: ImageAsset;
  gallery: ImageAsset[];
  liveUrl?: string;
  /**
   * `true` while the project still shows concept content.
   * Replace the copy and imagery with your real case study, then set to false
   * to remove the "Concept" badge.
   */
  isConcept: boolean;
};

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string };

export type PostCategory = "Design" | "Development" | "Strategy" | "Performance" | "Branding";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  date: string;
  author: string;
  cover: ImageAsset;
  featured?: boolean;
  body: PostBlock[];
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: ImageAsset;
  links?: { label: string; href: string }[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

export type Stat = { value: number; suffix?: string; label: string };
