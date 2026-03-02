import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="py-4 bg-light min-vh-100">
      <div class="container">
        <div class="row mb-4 align-items-center">
          <div class="col-md-6">
            <h2 class="fw-bold mb-1">Budgets</h2>
            <p class="text-muted mb-0">Monthly spending limits by category</p>
          </div>
          <div class="col-md-6 text-md-end mt-3 mt-md-0 d-flex justify-content-md-end gap-2">
            <div class="input-group" style="width: auto;">
              <select [(ngModel)]="currentMonth" (change)="loadBudgets()" class="form-select border-0 shadow-sm">
                 <option *ngFor="let m of months; let i = index" [value]="i+1">{{ m }}</option>
              </select>
              <select [(ngModel)]="currentYear" (change)="loadBudgets()" class="form-select border-0 shadow-sm">
                 <option *ngFor="let y of years" [value]="y">{{ y }}</option>
              </select>
            </div>
            <button class="btn btn-primary px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#setBudgetModal">
              <i class="bi bi-pencil-square me-2"></i>Set Budget
            </button>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-4" *ngFor="let b of budgets">
            <div class="card h-100 border-0 shadow-sm p-4">
               <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-bold mb-0 text-primary">{{ b.categoryName }}</h6>
                  <span class="badge" [class]="getRemaining(b) >= 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                     {{ getRemaining(b) >= 0 ? 'On Track' : 'Over Budget' }}
                  </span>
               </div>
               
               <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small">Spent: {{ b.spent | currency }}</span>
                  <span class="text-muted small">Target: {{ b.amount | currency }}</span>
               </div>
               
               <div class="progress mb-3" style="height: 10px;">
                  <div class="progress-bar" [class]="getProgressClass(b)" 
                       [style.width]="(b.spent / b.amount * 100) + '%'"></div>
               </div>
               
               <div class="d-flex justify-content-between align-items-center">
                  <span class="small fw-bold">{{ (b.spent / b.amount * 100) | number:'1.0-0' }}% used</span>
                  <span class="small" [class.text-danger]="getRemaining(b) < 0">
                    {{ getRemaining(b) >= 0 ? (getRemaining(b) | currency) + ' left' : (Math.abs(getRemaining(b)) | currency) + ' over' }}
                  </span>
               </div>
            </div>
          </div>
          
          <div *ngIf="budgets.length === 0" class="col-12 text-center py-5">
             <div class="card p-5 border-0 shadow-sm">
                <i class="bi bi-pie-chart fs-1 text-muted opacity-25 mb-3"></i>
                <h4 class="text-muted">No budgets set for this month</h4>
                <p class="text-muted mb-4">Planning your spending is the first step towards savings.</p>
                <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#setBudgetModal">Create First Budget</button>
             </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Set Budget Modal -->
    <div class="modal fade" id="setBudgetModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold text-dark">Set Category Budget</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form [formGroup]="budgetForm" (ngSubmit)="onSaveBudget()">
            <div class="modal-body py-4">
              <div class="mb-3">
                <label class="form-label small fw-bold text-dark">Category</label>
                <select formControlName="categoryId" class="form-select">
                  <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-dark">Budget Amount</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input type="number" formControlName="amount" class="form-control" placeholder="0.00">
                </div>
              </div>
              <div class="row g-2">
                <div class="col-6">
                   <label class="form-label small fw-bold text-dark">Month</label>
                   <select formControlName="month" class="form-select">
                      <option *ngFor="let m of months; let i = index" [value]="i+1">{{ m }}</option>
                   </select>
                </div>
                <div class="col-6">
                   <label class="form-label small fw-bold text-dark">Year</label>
                   <select formControlName="year" class="form-select">
                      <option *ngFor="let y of years" [value]="y">{{ y }}</option>
                   </select>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary px-4" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                Save Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `
})
export class BudgetsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private financeService = inject(FinanceService);
  private toastr = inject(ToastrService);

  Math = Math;
  budgets: any[] = [];
  categories: any[] = [];
  loading = false;

  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years = [2023, 2024, 2025];

  budgetForm = this.fb.group({
    categoryId: [null, Validators.required],
    amount: [null, [Validators.required, Validators.min(1)]],
    month: [this.currentMonth, Validators.required],
    year: [this.currentYear, Validators.required]
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.financeService.getCategories().subscribe(res => this.categories = res);
    this.loadBudgets();
  }

  loadBudgets() {
    this.financeService.getBudgets(this.currentYear, this.currentMonth).subscribe({
      next: (res) => this.budgets = res,
      error: () => {
         // Mock
         this.budgets = [
            { categoryId: 1, categoryName: 'Groceries', amount: 500, spent: 340.50 },
            { categoryId: 2, categoryName: 'Rent', amount: 1500, spent: 1500 },
            { categoryId: 3, categoryName: 'Entertainment', amount: 200, spent: 250.00 }
         ];
      }
    });
  }

  getRemaining(b: any) { return b.amount - b.spent; }

  getProgressClass(b: any) {
    const percent = (b.spent / b.amount) * 100;
    if (percent > 100) return 'bg-danger';
    if (percent > 85) return 'bg-warning';
    return 'bg-primary';
  }

  onSaveBudget() {
    if (this.budgetForm.invalid) return;
    this.loading = true;
    this.financeService.upsertBudget(this.budgetForm.value).subscribe({
      next: () => {
        this.toastr.success('Budget updated!');
        this.loadBudgets();
        this.loading = false;
        document.getElementById('setBudgetModal')?.querySelector('.btn-close')?.dispatchEvent(new Event('click'));
      },
      error: () => { this.toastr.error('Failed to update budget'); this.loading = false; }
    });
  }
}
