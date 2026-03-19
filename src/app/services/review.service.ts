import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReview } from '../models/review.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<IReview[]> {
    return this.http.get<IReview[]>(this.baseUrl);
  }

  getByRestaurant(restaurantId: string): Observable<IReview[]> {
    return this.http.get<IReview[]>(`${this.baseUrl}/restaurant/${restaurantId}`);
  }

  getByCustomer(customerId: string): Observable<IReview[]> {
    return this.http.get<IReview[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  create(review: Partial<IReview>): Observable<IReview> {
    return this.http.post<IReview>(this.baseUrl, review);
  }

  update(reviewId: string, review: Partial<IReview>): Observable<IReview> {
    return this.http.put<IReview>(`${this.baseUrl}/${reviewId}`, review);
  }

  delete(reviewId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${reviewId}`);
  }

  like(reviewId: string): Observable<IReview> {
    return this.http.post<IReview>(`${this.baseUrl}/${reviewId}/like`, {});
  }
}