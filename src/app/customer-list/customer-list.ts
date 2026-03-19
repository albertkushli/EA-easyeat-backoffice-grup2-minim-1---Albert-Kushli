import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/customer.service';
import { VisitService } from '../services/visit.service'; 
import { ICustomer } from '../models/customer.model';
import { IVisit } from '../models/visit.model'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './customer-list.html',
})
export class CustomerList implements OnInit {
  filteredCustomers: ICustomer[] = [];
  customers: ICustomer[] = [];
  loading = true;
  errorMsg = '';
  searchControl = new FormControl('');
  
  customerForm!: FormGroup;
  editting = false;
  showForm = false;
  customerEditId: string | undefined;

  expanded: { [key: string]: boolean } = {};
  customerVisits: { [key: string]: IVisit[] } = {};
  loadingVisits: { [key: string]: boolean } = {};
  
  visitForm!: FormGroup;
  activeVisitForm = false;
  isEditingVisit = false;
  currentCustomerId: string | null = null;
  selectedVisitId: string | null = null;

  // Propiedades de paginación corregidas
  currentPage: number = 1;
  pageSize: number = 5; 
  totalPages: number = 1;
  totalItems: number = 0;

  showAllCustomers = false;
  limit = 10;

  constructor(
    private api: CustomerService, 
    private visitService: VisitService, 
    private fb: FormBuilder, 
    private cdr: ChangeDetectorRef, 
    private dialog: MatDialog
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.visitForm = this.fb.group({
      restaurant_id: ['', [Validators.required, Validators.pattern(/^[0-9a-fA-F]{24}$/)]],
      billAmount: [0, [Validators.required, Validators.min(1)]],
      pointsEarned: [0, [Validators.required, Validators.min(0)]],
      date: [new Date().toISOString().substring(0, 10), Validators.required]
    });
  }

  ngOnInit(): void {
    this.load();

    this.searchControl.valueChanges.subscribe(value => {
      this.currentPage = 1; // Resetear página al buscar
      const term = value?.toLowerCase() ?? '';
      this.filteredCustomers = this.customers.filter(customer =>
        customer.name.toLowerCase().includes(term)
      );
    });
  }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    // Si tu CustomerService también tiene paginación, pasa los parámetros aquí
    this.api.getCustomers().subscribe({
      next: (res: any) => {
        // Manejo flexible de respuesta (array u objeto con data)
        this.customers = res.data || res; 
        this.filteredCustomers = [...this.customers];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMsg = 'Could not load customers.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  toggleExpand(id: string): void {
    this.expanded[id] = !this.expanded[id];
    if (this.expanded[id]) {
      this.loadVisits(id);
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Si la paginación es de visitas, recargamos la visita del cliente activo
      if (this.currentCustomerId) {
        this.loadVisits(this.currentCustomerId);
      }
    }
  }

  loadVisits(customerId: string): void {
    this.loadingVisits[customerId] = true;
    this.currentCustomerId = customerId; // Guardamos el ID actual para la paginación
    this.cdr.markForCheck();

    // Enviamos página y tamaño al servicio (asegúrate de que tu service.ts acepte estos params)
    this.visitService.getVisitsByCustomer(customerId, this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        // IMPORTANTE: Ahora el backend devuelve { data: [], pagination: {} }
        this.customerVisits[customerId] = res.data; 
        this.totalPages = res.pagination.pages;
        this.totalItems = res.pagination.total;
        
        this.loadingVisits[customerId] = false;
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error('Error loading visits', err);
        this.loadingVisits[customerId] = false;
        this.cdr.markForCheck();
      }
    });
  }

  // --- RESTO DE MÉTODOS DE VISITAS ---

  saveVisit(): void {
    if (this.visitForm.invalid) return;
    const formValue = this.visitForm.value;

    if (this.isEditingVisit && this.selectedVisitId) {
      const updatePayload = {
        date: formValue.date,
        pointsEarned: Number(formValue.pointsEarned),
        billAmount: Number(formValue.billAmount)
      };

      this.visitService.updateVisit(this.selectedVisitId, updatePayload).subscribe({
        next: () => {
          this.loadVisits(this.currentCustomerId!);
          this.cancelVisitForm();
        },
        error: (err) => alert('Error al actualizar: ' + (err.error?.message || 'Revisa Joi'))
      });

    } else {
      const createPayload = {
        customer_id: this.currentCustomerId,
        restaurant_id: formValue.restaurant_id,
        date: formValue.date,
        pointsEarned: Number(formValue.pointsEarned),
        billAmount: Number(formValue.billAmount)
      };

      this.visitService.createVisit(createPayload).subscribe(() => {
        this.loadVisits(this.currentCustomerId!);
        this.cancelVisitForm();
      });
    }
  }

  softDeleteVisit(visitId: string, customerId: string): void {
    if (confirm('¿Deseas enviar esta visita a la papelera?')) {
      // El backend ahora acepta deletedAt gracias al cambio en Schemas.ts
      const updateData = { deletedAt: new Date() };
      
      this.visitService.updateVisit(visitId, updateData).subscribe({
        next: () => {
          this.loadVisits(customerId); // Desaparecerá porque el backend filtra deletedAt: null
        },
        error: (err) => console.error('Error en Soft Delete:', err)
      });
    }
  }

  deleteVisit(visitId: string, customerId: string): void {
    if (confirm('¿Seguro que quieres borrar permanentemente (Hard Delete)?')) {
      this.visitService.deleteVisit(visitId).subscribe(() => {
        this.loadVisits(customerId);
      });
    }
  }

  // --- GESTIÓN DE FORMULARIOS Y OTROS ---

  prepareNewVisit(customerId: string): void {
    this.currentCustomerId = customerId;
    this.isEditingVisit = false;
    this.activeVisitForm = true;
    this.visitForm.reset({ 
      date: new Date().toISOString().substring(0, 10), 
      billAmount: 0, 
      pointsEarned: 0 
    });
  }

  editVisit(visit: any, customerId: string): void {
    this.currentCustomerId = customerId;
    this.selectedVisitId = visit._id;
    this.isEditingVisit = true;
    this.activeVisitForm = true;
    
    const restaurantId = visit.restaurant_id?._id || visit.restaurant_id;
    const formattedDate = new Date(visit.date).toISOString().substring(0, 10);

    this.visitForm.patchValue({
      restaurant_id: restaurantId,
      billAmount: visit.billAmount,
      pointsEarned: visit.pointsEarned,
      date: formattedDate
    });
  }

  cancelVisitForm(): void {
    this.activeVisitForm = false;
    this.selectedVisitId = null;
    this.visitForm.reset();
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

  delete(id: string) {
    this.api.deleteCustomer(id).subscribe(() => this.load());
  }

  toggleShowForm(): void {
    if (this.editting) {
      this.showForm = true;
      this.editting = false;
      this.customerForm.reset();
    } else { 
      this.showForm = !this.showForm; 
    }
  }

  showMore(): void { this.showAllCustomers = true; }

  get visibleCustomers(): ICustomer[] {
    return this.showAllCustomers 
      ? this.filteredCustomers 
      : this.filteredCustomers.slice(0, this.limit);
  }

  edit(customer: ICustomer): void {
    this.showForm = true;
    this.editting = true;
    this.customerEditId = customer._id;
    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
      password: '****'
    });
  }

  resetForm(): void {
    this.showForm = false;
    this.editting = false;
    this.customerEditId = undefined;
    this.customerForm.reset();
  }

  confirmDelete(id: string, name?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: name });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.delete(id);
    });
  }
}