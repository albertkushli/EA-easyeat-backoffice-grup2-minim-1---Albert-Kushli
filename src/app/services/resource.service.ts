import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResource, IResourceItem } from '../models/resource.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createResource(data: Partial<IResource>): Observable<IResource> {
    return this.http.post<IResource>(`${this.baseUrl}/recursos`, data);
  }

  getResources(): Observable<IResource[]> {
    return this.http.get<IResource[]>(`${this.baseUrl}/recursos`);
  }

  getResourceByRestaurant(restaurantId: string): Observable<IResource> {
    return this.http.get<IResource>(`${this.baseUrl}/recursos/restaurant/${restaurantId}`);
  }

  addItem(resourceId: string, item: IResourceItem): Observable<IResource> {
    return this.http.post<IResource>(`${this.baseUrl}/recursos/${resourceId}/items`, item);
  }

  removeItem(resourceId: string, itemId: string): Observable<IResource> {
    return this.http.delete<IResource>(`${this.baseUrl}/recursos/${resourceId}/items/${itemId}`);
  }

  deleteResource(resourceId: string): Observable<IResource> {
    return this.http.delete<IResource>(`${this.baseUrl}/recursos/${resourceId}`);
  }
}
