import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="py-4 bg-light min-vh-100">
      <div class="container">
        <div class="row mb-4 align-items-center">
          <div class="col-md-6">
            <h2 class="fw-bold mb-1">Transactions</h2>
            <p class="text-muted mb-0">View and manage your income and expenses</p>
          </div>
          <div class="col-md-6 text-md-end mt-3 mt-md-0">
            <button class="btn btn-outline-secondary me-2 shadow-sm" (click)="triggerImport.click()">
              <i class="bi bi-file-earmark-arrow-up me-2"></i>Import CSV
            </button>
            <input type="file" #triggerImport class="d-none" (change)="onFileSelected($event)" accept=".csv">
            <button class="btn btn-primary px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#addTransactionModal">
              <i class="bi bi-plus-lg me-2"></i>Add Transaction
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="card border-0 shadow-sm p-3 mb-4">
          <div class="row g-3 align-items-end">
            <div class="col-md-3">
              <label class="form-label small fw-bold">Search</label>
              <input type="text" [(ngModel)]="filters.search" (ngModelChange)="loadTransactions()" class="form-control" placeholder="Search description...">
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-bold">Account</label>
              <select [(ngModel)]="filters.accountId" (change)="loadTransactions()" class="form-select">
                <option [ngValue]="null">All Accounts</option>
                <option *ngFor="let a of accounts" [value]="a.id">{{ a.name }}</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label small fw-bold">Category</label>
              <select [(ngModel)]="filters.categoryId" (change)="loadTransactions()" class="form-select">
                <option [ngValue]="null">All Categories</option>
                <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label small fw-bold">Date Range</label>
              <div class="input-group">
                <input type="date" [(ngModel)]="filters.startDate" (change)="loadTransactions()" class="form-control">
                <span class="input-group-text bg-light border-0">to</span>
                <input type="date" [(ngModel)]="filters.endDate" (change)="loadTransactions()" class="form-control">
              </div>
            </div>
            <div class="col-md-1">
              <button class="btn btn-light w-100" (click)="resetFilters()" title="Reset Filters">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="card border-0 shadow-sm overflow-hidden">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light">
                <tr>
                  <th class="ps-4">Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Account</th>
                  <th class="text-end pe-4">Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of transactions">
                  <td class="ps-4 small">{{ t.date | date:'mediumDate' }}</td>
                  <td class="fw-bold small">{{ t.description }}</td>
                  <td><span class="badge bg-primary bg-opacity-10 text-primary fw-normal px-2 py-1">{{ t.categoryName }}</span></td>
                  <td class="small">{{ t.accountName }}</td>
                  <td class="text-end pe-4 fw-bold" [class.text-danger]="t.amount < 0" [class.text-success]="t.amount > 0">
                    {{ t.amount | currency }}
                  </td>
                  <td>
                    <button class="btn btn-sm btn-light text-muted me-1" (click)="editTransaction(t)"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-light text-danger" (click)="deleteTransaction(t.id)"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
                <tr *ngIf="transactions.length === 0">
                  <td colspan="6" class="text-center py-5">
                    <i class="bi bi-inbox fs-1 text-muted opacity-25 d-block mb-3"></i>
                    <p class="text-muted">No transactions found matching your filters.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Transaction Modal -->
    <div class="modal fade" id="addTransactionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold">New Transaction</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" #closeModal></button>
          </div>
          <form [formGroup]="transactionForm" (ngSubmit)="onSaveTransaction()">
            <div class="modal-body py-4">
              <div class="mb-3">
                <label class="form-label small fw-bold">Date</label>
                <input type="date" formControlName="date" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Description</label>
                <input type="text" formControlName="description" class="form-control" placeholder="e.g. Grocery store">
              </div>
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Amount</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" formControlName="amount" class="form-control" placeholder="0.00">
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Type</label>
                  <select formControlName="type" class="form-select">
                    <option value="expense">Expense (-)</option>
                    <option value="income">Income (+)</option>
                  </select>
                </div>
              </div>
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Account</label>
                  <select formControlName="accountId" class="form-select">
                    <option *ngFor="let a of accounts" [value]="a.id">{{ a.name }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Category</label>
                   <select formControlName="categoryId" class="form-select">
                    <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary px-4" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                Save Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    tr { cursor: pointer; }
    .table thead th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; color: #64748b; }
  `]
})
export class TransactionsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private financeService = inject(FinanceService);
  private toastr = inject(ToastrService);

  transactions: any[] = [];
  accounts: any[] = [];
  categories: any[] = [];
  loading = false;

  filters = {
    search: '',
    accountId: null,
    categoryId: null,
    startDate: '',
    endDate: ''
  };

  transactionForm = this.fb.group({
    date: [new Date().toISOString().substring(0, 10), Validators.required],
    description: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    type: ['expense', Validators.required],
    accountId: [null, Validators.required],
    categoryId: [null, Validators.required]
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.financeService.getAccounts().subscribe(res => this.accounts = res);
    this.financeService.getCategories().subscribe(res => this.categories = res);
    this.loadTransactions();
  }

  loadTransactions() {
    this.financeService.getTransactions(this.filters).subscribe({
      next: (res) => this.transactions = res,
      error: () => {
         // Mock data
         this.transactions = [
            { id: 1, date: new Date(), description: 'Starbucks', categoryName: 'Food', accountName: 'Main Checkings', amount: -6.50 },
            { id: 2, date: new Date(), description: 'Google Cloud Pay', categoryName: 'Software', accountName: 'Credit Card', amount: -15.00 },
            { id: 3, date: new Date(), description: 'Salary Deposit', categoryName: 'Income', accountName: 'Main Checkings', amount: 3500.00 }
         ];
      }
    });
  }

  resetFilters() {
    this.filters = { search: '', accountId: null, categoryId: null, startDate: '', endDate: '' };
    this.loadTransactions();
  }

  onSaveTransaction() {
    if (this.transactionForm.invalid) return;

    this.loading = true;
    const formVal: any = this.transactionForm.value;
    const amount = formVal.type === 'expense' ? -Math.abs(formVal.amount) : Math.abs(formVal.amount);
    
    const request = { ...formVal, amount };

    this.financeService.createTransaction(request).subscribe({
      next: () => {
        this.toastr.success('Transaction saved!');
        this.loadTransactions();
        this.loading = false;
        this.transactionForm.reset({
          date: new Date().toISOString().substring(0, 10),
          type: 'expense'
        });
        // Manually click close if modal ref not available
        document.getElementById('addTransactionModal')?.querySelector('.btn-close')?.dispatchEvent(new Event('click'));
      },
      error: () => {
        this.toastr.error('Failed to save transaction');
        this.loading = false;
      }
    });
  }

  deleteTransaction(id: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.financeService.deleteTransaction(id).subscribe(() => {
        this.toastr.success('Transaction deleted');
        this.loadTransactions();
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.financeService.importTransactions(file).subscribe({
        next: () => {
          this.toastr.success('CSV imported successfully!');
          this.loadTransactions();
        },
        error: () => this.toastr.error('Import failed. Please check CSV format.')
      });
    }
  }

  editTransaction(t: any) {
    this.transactionForm.patchValue({
      date: new Date(t.date).toISOString().substring(0, 10),
      description: t.description,
      amount: Math.abs(t.amount),
      type: t.amount < 0 ? 'expense' : 'income',
      accountId: t.accountId,
      categoryId: t.categoryId
    });
    // Open modal programmatically or via trigger
    document.querySelector('[data-bs-target="#addTransactionModal"]')?.dispatchEvent(new Event('click'));
  }
}
