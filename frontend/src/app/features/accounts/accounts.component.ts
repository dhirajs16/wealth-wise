import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="py-4 bg-light min-vh-100">
      <div class="container">
        <div class="row mb-4 align-items-center">
          <div class="col-md-6">
            <h2 class="fw-bold mb-1">Accounts</h2>
            <p class="text-muted mb-0">Manage your bank accounts, cards, and cash</p>
          </div>
          <div class="col-md-6 text-md-end mt-3 mt-md-0">
            <button class="btn btn-primary px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#addAccountModal">
              <i class="bi bi-plus-lg me-2"></i>Add Account
            </button>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-4" *ngFor="let a of accounts">
            <div class="card h-100 border-0 shadow-sm overflow-hidden">
               <div class="card-body p-4">
                 <div class="d-flex justify-content-between align-items-start mb-4">
                    <div class="rounded-circle bg-primary bg-opacity-10 p-3 text-primary">
                       <i class="bi" [class]="getAccountIcon(a.type) + ' fs-4'"></i>
                    </div>
                    <div class="dropdown">
                      <button class="btn btn-light btn-sm rounded-circle" data-bs-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></button>
                      <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                         <li><a class="dropdown-item" (click)="editAccount(a)">Edit</a></li>
                         <li><a class="dropdown-item text-danger" (click)="deleteAccount(a.id)">Delete</a></li>
                      </ul>
                    </div>
                 </div>
                 <h5 class="fw-bold mb-1">{{ a.name }}</h5>
                 <p class="text-muted small mb-4">{{ a.type }}</p>
                 <h3 class="fw-bold mb-0">{{ a.balance | currency }}</h3>
               </div>
               <div class="card-footer bg-light border-0 px-4 py-3">
                 <a [routerLink]="['/transactions']" [queryParams]="{accountId: a.id}" class="text-decoration-none small fw-bold">View Transactions <i class="bi bi-arrow-right ms-1"></i></a>
               </div>
            </div>
          </div>
          
          <div *ngIf="accounts.length === 0" class="col-12 text-center py-5">
             <div class="card p-5 border-0 shadow-sm">
                <i class="bi bi-bank fs-1 text-muted opacity-25 mb-3"></i>
                <h4 class="text-muted">No accounts found</h4>
                <p class="text-muted mb-4">Add your first bank account or credit card to get started.</p>
                <button class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#addAccountModal">Add First Account</button>
             </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Account Modal -->
    <div class="modal fade" id="addAccountModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold">Add Account</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form [formGroup]="accountForm" (ngSubmit)="onSaveAccount()">
            <div class="modal-body py-4">
              <div class="mb-3">
                <label class="form-label small fw-bold">Account Name</label>
                <input type="text" formControlName="name" class="form-control" placeholder="e.g. Chase Checkings">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Account Type</label>
                <select formControlName="type" class="form-select">
                  <option value="Checking">Checking</option>
                  <option value="Savings">Savings</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">Initial Balance</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input type="number" formControlName="initialBalance" class="form-control" placeholder="0.00">
                </div>
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary px-4" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                Add Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `
})
export class AccountsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private financeService = inject(FinanceService);
  private toastr = inject(ToastrService);

  accounts: any[] = [];
  loading = false;

  accountForm = this.fb.group({
    name: ['', Validators.required],
    type: ['Checking', Validators.required],
    initialBalance: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.financeService.getAccounts().subscribe({
      next: (res) => this.accounts = res,
      error: () => {
         // Mock
         this.accounts = [
            { id: 1, name: 'Main Checking', type: 'Checking', balance: 5240.25 },
            { id: 2, name: 'High-Yield Savings', type: 'Savings', balance: 12000.00 },
            { id: 3, name: 'Visa Credit Card', type: 'Credit Card', balance: -450.70 }
         ];
      }
    });
  }

  onSaveAccount() {
    if (this.accountForm.invalid) return;
    this.loading = true;
    this.financeService.createAccount(this.accountForm.value).subscribe({
      next: () => {
        this.toastr.success('Account added!');
        this.loadAccounts();
        this.loading = false;
        this.accountForm.reset({ type: 'Checking', initialBalance: 0 });
        document.getElementById('addAccountModal')?.querySelector('.btn-close')?.dispatchEvent(new Event('click'));
      },
      error: () => { this.toastr.error('Failed to add account'); this.loading = false; }
    });
  }

  deleteAccount(id: number) {
    if (confirm('Are you sure? Only accounts with no transactions can be deleted.')) {
      this.financeService.deleteAccount(id).subscribe({
        next: () => { this.toastr.success('Account deleted'); this.loadAccounts(); },
        error: (err) => this.toastr.error(err.error || 'Cannot delete account')
      });
    }
  }

  getAccountIcon(type: string) {
    switch (type) {
      case 'Checking': return 'bi-bank';
      case 'Savings': return 'bi-piggy-bank';
      case 'Credit Card': return 'bi-credit-card';
      case 'Cash': return 'bi-cash-coin';
      case 'Investment': return 'bi-graph-up';
      default: return 'bi-wallet2';
    }
  }

  editAccount(a: any) {
    // Implement edit logic if needed
  }
}
