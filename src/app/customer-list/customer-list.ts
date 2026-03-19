import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { ReviewService } from '../services/review.service';
import { RestaurantService } from '../services/restaurant.service';

import { ICustomer } from '../models/customer.model';
import { IReview } from '../models/review.model';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './customer-list.html',
})
export class CustomerList implements OnInit {
  customers: ICustomer[] = [];
  filteredCustomers: ICustomer[] = [];

  customerEditId: string | undefined;
  reviewsByCustomer: { [key: string]: IReview[] } = {};
  restaurants: any[] = [];

  loading = true;
  errorMsg = '';

  searchControl = new FormControl('');

  customerForm!: FormGroup;
  reviewForm!: FormGroup;

  selectedCustomerId: string | null = null;
  editingReviewId: string | null = null;

  editting = false;
  showForm = false;

  expanded: { [key: string]: boolean } = {};

  showAllCustomers = false;
  limit = 10;

  constructor(
    private api: CustomerService,
    private reviewService: ReviewService,
    private restaurantService: RestaurantService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.reviewForm = this.fb.group({
      restaurant_id: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.load();
    this.loadRestaurants();

    this.searchControl.valueChanges.subscribe(value => {
      const term = value?.toLowerCase() ?? '';

      this.filteredCustomers = this.customers.filter(c =>
        c.name.toLowerCase().includes(term)
      );
    });
  }

  // ========================
  // CUSTOMERS
  // ========================

  load(): void {
    this.api.getCustomers().subscribe({
      next: (res: any) => {
        this.customers = res.data;
        this.filteredCustomers = [...this.customers];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMsg = 'Error loading customers';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  guardar(): void {
    if (this.customerForm.invalid) return;

    const data = this.customerForm.value;

    if (this.editting && this.customerEditId) {
      this.api.updateCustomer(this.customerEditId, data).subscribe(() => {
        this.load();
        this.resetForm();
      });
    } else {
      this.api.createCustomer(data).subscribe(() => {
        this.load();
        this.resetForm();
      });
    }
  }

  delete(id: string): void {
    this.api.deleteCustomer(id).subscribe(() => this.load());
  }

  edit(customer: ICustomer): void {
    this.showForm = true;
    this.editting = true;
    this.customerEditId = customer._id;

    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
      password: ''
    });
  }

  resetForm(): void {
    this.showForm = false;
    this.editting = false;
    this.customerEditId = undefined;
    this.customerForm.reset();
  }

  toggleShowForm(): void {
    if (this.editting) {
      this.showForm = true;
      this.editting = false;

      this.customerForm.patchValue({
        name: '',
        email: '',
        password: ''
      });
    } else {
      this.showForm = !this.showForm;
    }
  }

  showMore(): void {
    this.showAllCustomers = true;
  }

  get visibleCustomers(): ICustomer[] {
    if (this.showAllCustomers) {
      return this.filteredCustomers;
    }
    return this.filteredCustomers.slice(0, this.limit);
  }

  // ========================
  // RESTAURANTS
  // ========================

  loadRestaurants(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (res: any) => {
        this.restaurants = res.data ?? res;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading restaurants', err);
      }
    });
  }

  // ========================
  // REVIEWS
  // ========================

  toggleExpand(id: string): void {
    this.expanded[id] = !this.expanded[id];

    if (this.expanded[id] && !this.reviewsByCustomer[id]) {
      this.loadReviews(id);
    }
  }

  loadReviews(customerId: string): void {
    this.reviewService.getByCustomer(customerId).subscribe({
      next: (reviews) => {
        this.reviewsByCustomer[customerId] = reviews;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading reviews', err);
      }
    });
  }

  openReviewForm(customerId: string): void {
    this.selectedCustomerId = customerId;
    this.editingReviewId = null;
    this.reviewForm.reset();
  }
editReview(review: IReview): void {
  console.log('editReview', review);

  // 🔥 NORMALIZAR customer_id
  const customerId =
    typeof review.customer_id === 'string'
      ? review.customer_id
      : review.customer_id._id;

  this.selectedCustomerId = customerId;
  this.editingReviewId = review._id!;

  this.expanded[customerId] = true;

  this.reviewForm.reset();

  this.reviewForm.patchValue({
    restaurant_id: review.restaurant_id._id,
    rating: review.rating,
    comment: review.comment ?? ''
  });

  this.cdr.markForCheck();
}

createReview(): void {
  if (this.reviewForm.invalid || !this.selectedCustomerId) return;

  let data: any;

  if (this.editingReviewId) {
    // ✏️ UPDATE
    data = {
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment
    };

    this.reviewService.update(this.editingReviewId, data).subscribe({
      next: () => {
        this.finishReviewAction();
      },
      error: (err) => {
        console.error('Error updating review', err);
      }
    });

    return;
  }

  // ➕ CREATE
  const restaurantId = this.reviewForm.value.restaurant_id;

  const existing = this.reviewsByCustomer[this.selectedCustomerId]?.find(
    r => r.restaurant_id._id === restaurantId
  );

  if (existing) {
    alert('You already reviewed this restaurant');
    return;
  }

  data = {
    ...this.reviewForm.value,
    customer_id: this.selectedCustomerId,
    date: new Date()
  };

  this.reviewService.create(data).subscribe({
    next: () => {
      this.finishReviewAction();
    },
    error: (err) => {
      console.error('Error creating review', err);
    }
  });
}
finishReviewAction(): void {
  const customerId = this.selectedCustomerId;

  this.reviewForm.reset();
  this.selectedCustomerId = null;
  this.editingReviewId = null;

  if (customerId) {
    this.loadReviews(customerId);
  }

  this.cdr.markForCheck();
}

  deleteReview(reviewId: string, customerId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Delete this review?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reviewService.delete(reviewId).subscribe({
          next: () => {
            this.loadReviews(customerId);
          },
          error: (err) => {
            console.error('Error deleting review', err);
          }
        });
      }
    });
  }

  like(review: IReview): void {
    this.reviewService.like(review._id!).subscribe({
      next: (updated) => {
        review.likes = updated.likes;
      },
      error: (err) => {
        console.error('Error liking review', err);
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating / 2)).fill(0);
  }

  // ========================

  confirmDelete(id: string, name?: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: name });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.delete(id);
    });
  }
}