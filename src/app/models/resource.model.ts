export interface IResourceItem {
  _id?: string;
  url: string;
  type: 'manual' | 'video' | 'noticia';
  description: string;
}

export interface IResource {
  _id?: string;
  restaurant_id: string;
  items: IResourceItem[];
  createdAt?: Date;
  updatedAt?: Date;
}
