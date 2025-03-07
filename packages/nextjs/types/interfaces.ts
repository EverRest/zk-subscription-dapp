export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Link {
  id: number;
  title: string;
  url: string;
  description?: string;
  tags: string[];
}

export interface Schema {
  id: number;
  name: string;
  tier: string;
  description: string;
  price: string;
  image: string;
}

export interface Tag {
  id: number;
  name: string;
  code: string;
}
