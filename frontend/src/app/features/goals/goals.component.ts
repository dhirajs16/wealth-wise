import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="py-4 bg-light min-vh-100">
      <div class="container">
        <div class="row mb-4 align-items-center">
          <div class="col-md-6">
            <h2 class="fw-bold mb-1">Financial Goals</h2>
            <p class="text-muted mb-0">Track your progress towards big milestones</p>
          </div>
          <div class="col-md-6 text-md-end mt-3 mt-md-0">
            <button class="btn btn-primary px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#addGoalModal">
              <i class="bi bi-plus-lg me-2"></i>New Goal
            </button>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-4" *ngFor="let g of goals">
            <div class="card h-100 border-0 shadow-sm p-4">
               <div class="d-flex justify-content-between align-items-center mb-4">
                  <div class="goal-icon bg-info bg-opacity-10 text-info p-3 rounded-4">
                     <i class="bi bi-trophy-fill fs-4"></i>
                  </div>
                  <div class="dropdown">
                    <button class="btn btn-light btn-sm rounded-circle" data-bs-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></button>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                       <li><a class="dropdown-item" (click)="editGoal(g)">Update Progress</a></li>
                       <li><a class="dropdown-item text-danger" (click)="deleteGoal(g.id)">Delete</a></li>
                    </ul>
                  </div>
               </div>

               <h5 class="fw-bold mb-1 text-dark">{{ g.name }}</h5>
               <p class="text-muted small mb-4">Deadline: {{ g.deadline | date:'mediumDate' }}</p>
               
               <div class="d-flex justify-content-between mb-2">
                  <span class="fw-bold">{{ g.currentAmount | currency }}</span>
                  <span class="text-muted">Target: {{ g.targetAmount | currency }}</span>
               </div>
               
               <div class="progress mb-3" style="height: 12px; border-radius: 6px;">
                  <div class="progress-bar bg-info" [style.width]="(g.currentAmount / g.targetAmount * 100) + '%'"></div>
               </div>
               
               <div class="d-flex justify-content-between">
                  <span class="small fw-bold text-info">{{ (g.currentAmount / g.targetAmount * 100) | number:'1.0-0' }}% Complete</span>
                  <span class="small text-muted">{{ (g.targetAmount - g.currentAmount) | currency }} to go</span>
               </div>
               
               <div class="mt-4 pt-3 border-top">
                  <p class="small text-muted mb-0">Suggested saving: <strong>{{ (g.targetAmount - g.currentAmount) / 12 | currency }}/mo</strong></p>
               </div>
            </div>
          </div>

          <div *ngIf="goals.length === 0" class="col-12 text-center py-5">
             <div class="card p-5 border-0 shadow-sm">
                <i class="bi bi-bullseye fs-1 text-muted opacity-25 mb-3"></i>
                <h4 class="text-muted">No goals set yet</h4>
                <p class="text-muted mb-4">Whether it's a new car or retirement, tracking helps you get there faster.</p>
                <button class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#addGoalModal">Create Your First Goal</button>
             </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Goal Modal -->
    <div class="modal fade" id="addGoalModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="fw-bold text-dark">Set Financial Goal</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form [formGroup]="goalForm" (ngSubmit)="onSaveGoal()">
            <div class="modal-body py-4">
              <div class="mb-3">
                <label class="form-label small fw-bold text-dark">Goal Name</label>
                <input type="text" formControlName="name" class="form-control" placeholder="e.g. Dream House">
              </div>
              <div class="row g-3">
                 <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold text-dark">Target Amount</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input type="number" formControlName="targetAmount" class="form-control" placeholder="0.00">
                    </div>
                 </div>
                 <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold text-dark">Starting Amount</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input type="number" formControlName="currentAmount" class="form-control" placeholder="0.00">
                    </div>
                 </div>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold text-dark">Target Date (Deadline)</label>
                <input type="date" formControlName="deadline" class="form-control">
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary px-4" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                Create Goal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .goal-icon { display: inline-flex; align-items: center; justify-content: center; }
  `]
})
export class GoalsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private financeService = inject(FinanceService);
  private toastr = inject(ToastrService);

  goals: any[] = [];
  loading = false;

  goalForm = this.fb.group({
    name: ['', Validators.required],
    targetAmount: [null, [Validators.required, Validators.min(1)]],
    currentAmount: [0, [Validators.required, Validators.min(0)]],
    deadline: ['', Validators.required]
  });

  ngOnInit() {
    this.loadGoals();
  }

  loadGoals() {
    this.financeService.getGoals().subscribe({
      next: (res) => this.goals = res,
      error: () => {
         // Mock
         this.goals = [
            { id: 1, name: 'Emergency Fund', targetAmount: 10000, currentAmount: 6500, deadline: '2025-12-31' },
            { id: 2, name: 'New Tesla', targetAmount: 50000, currentAmount: 12000, deadline: '2027-06-30' }
         ];
      }
    });
  }

  onSaveGoal() {
    if (this.goalForm.invalid) return;
    this.loading = true;
    this.financeService.createGoal(this.goalForm.value).subscribe({
      next: () => {
        this.toastr.success('Goal created!');
        this.loadGoals();
        this.loading = false;
        document.getElementById('addGoalModal')?.querySelector('.btn-close')?.dispatchEvent(new Event('click'));
      },
      error: () => { this.toastr.error('Failed to create goal'); this.loading = false; }
    });
  }

  deleteGoal(id: number) {
    if (confirm('Are you sure you want to delete this goal?')) {
      this.financeService.deleteGoal(id).subscribe(() => {
        this.toastr.success('Goal deleted');
        this.loadGoals();
      });
    }
  }

  editGoal(g: any) {
    // Implement update progress logic
  }
}
