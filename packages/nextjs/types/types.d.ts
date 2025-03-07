export type Subscription = {
  name: string;
  tier: string;
  description: string;
  price: string;
  image: string;
};

export type Content = {
  title: string;
  body: string;
  tags: string[];
};

export interface Category {
  id?: string;
  name: string;
  description?: string;
}

export interface Link {
  id?: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
}

export interface Schema {
  id: string;
  name: string;
  tier: string;
  description: string;
  price: string;
  image: string;
}

export interface Tag {
  id: string;
  name: string;
  code: string;
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  HEAD = "HEAD",
}
