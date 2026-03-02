import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FinanceService } from '../../core/services/finance.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NgxChartsModule } from 'ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, NgxChartsModule],
  template: `
    <app-navbar></app-navbar>

    <main class="py-4 bg-light min-vh-100">
      <div class="container">
        <!-- Welcome Header -->
        <div class="row mb-4 align-items-center">
          <div class="col-md-6">
            <h2 class="fw-bold mb-1">Dashboard</h2>
            <p class="text-muted mb-0">Overview of your financial situation</p>
          </div>
          <div class="col-md-6 text-md-end mt-3 mt-md-0">
            <button class="btn btn-primary px-4 shadow-sm me-2" routerLink="/transactions">
              <i class="bi bi-plus-lg me-2"></i>Add Transaction
            </button>
            <button class="btn btn-outline-primary px-4 shadow-sm" routerLink="/reports">
              <i class="bi bi-file-earmark-bar-graph me-2"></i>View Reports
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="row g-4 mb-4">
          <div class="col-md-4">
            <div class="card p-4 bg-primary text-white border-0 shadow">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-uppercase mb-0 opacity-75 small fw-bold">Net Worth</h6>
                <div class="rounded-circle bg-white bg-opacity-25 p-2"><i class="bi bi-wallet2 fs-5"></i></div>
              </div>
              <h2 class="fw-bold mb-1">{{ summary.netWorth | currency }}</h2>
              <p class="mb-0 small opacity-75 mt-2">
                <i class="bi bi-arrow-up-right me-1"></i> +2.5% from last month
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-4 bg-white border-0 shadow-sm">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-uppercase mb-0 text-muted small fw-bold">Monthly Income</h6>
                <div class="rounded-circle bg-success bg-opacity-10 p-2 text-success"><i class="bi bi-arrow-down-left fs-5"></i></div>
              </div>
              <h2 class="fw-bold mb-1 text-dark">{{ summary.monthlyIncome | currency }}</h2>
              <div class="progress mt-3" style="height: 6px;">
                <div class="progress-bar bg-success" style="width: 75%"></div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-4 bg-white border-0 shadow-sm">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-uppercase mb-0 text-muted small fw-bold">Monthly Expenses</h6>
                <div class="rounded-circle bg-danger bg-opacity-10 p-2 text-danger"><i class="bi bi-arrow-up-right fs-5"></i></div>
              </div>
              <h2 class="fw-bold mb-1 text-dark">{{ summary.monthlyExpenses | currency }}</h2>
              <div class="progress mt-3" style="height: 6px;">
                <div class="progress-bar bg-danger" [style.width]="(summary.monthlyExpenses / summary.monthlyIncome * 100) + '%'"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Tables -->
        <div class="row g-4">
          <!-- Monthly Trends -->
          <div class="col-lg-8">
            <div class="card h-100 p-4 border-0 shadow-sm">
              <h5 class="fw-bold mb-4">Spending Trends</h5>
              <div class="chart-container" style="height: 300px;">
                 <ngx-charts-area-chart
                  [results]="multi"
                  [scheme]="colorScheme"
                  [legend]="true"
                  [showXAxisLabel]="false"
                  [showYAxisLabel]="false"
                  [xAxis]="true"
                  [yAxis]="true"
                  [animations]="true">
                </ngx-charts-area-chart>
              </div>
            </div>
          </div>

          <!-- Quick Actions/Recent Transactions -->
          <div class="col-lg-4">
            <div class="card h-100 p-4 border-0 shadow-sm">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold mb-0">Recent Transactions</h5>
                <a routerLink="/transactions" class="small text-decoration-none">See All</a>
              </div>
              <div class="transaction-list">
                <div *ngFor="let t of summary.recentTransactions" class="d-flex align-items-center justify-content-between py-3 border-bottom">
                  <div class="d-flex align-items-center">
                    <div class="icon-box bg-light rounded-circle p-2 me-3 text-primary">
                      <i class="bi bi-cart4" *ngIf="t.amount < 0"></i>
                      <i class="bi bi-cash" *ngIf="t.amount > 0"></i>
                    </div>
                    <div>
                      <h6 class="mb-0 fw-bold small">{{ t.description }}</h6>
                      <small class="text-muted">{{ t.date | date:'shortDate' }} • {{ t.categoryName }}</small>
                    </div>
                  </div>
                  <span class="fw-bold" [class.text-danger]="t.amount < 0" [class.text-success]="t.amount > 0">
                    {{ t.amount | currency }}
                  </span>
                </div>
                <div *ngIf="summary.recentTransactions.length === 0" class="text-center py-5">
                   <p class="text-muted small">No recent transactions found.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <app-footer></app-footer>
  `,
  styles: [`
    .icon-box { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; }
    .chart-container { width: 100%; position: relative; }
  `]
})
export class DashboardComponent implements OnInit {
  private financeService = inject(FinanceService);

  summary = {
    netWorth: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    recentTransactions: [] as any[]
  };

  multi = [
    {
      "name": "Income",
      "series": [
        { "name": "Jan", "value": 4000 },
        { "name": "Feb", "value": 4500 },
        { "name": "Mar", "value": 4200 }
      ]
    },
    {
      "name": "Expenses",
      "series": [
        { "name": "Jan", "value": 2500 },
        { "name": "Feb", "value": 3100 },
        { "name": "Mar", "value": 2800 }
      ]
    }
  ];

  colorScheme: any = {
    domain: ['#10b981', '#ef4444', '#3b82f6', '#f59e0b']
  };

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.financeService.getDashboardSummary().subscribe({
      next: (res) => {
        this.summary = res;
      },
      error: () => {
        // Mock data if API fails
        this.summary = {
          netWorth: 12540.50,
          monthlyIncome: 4500,
          monthlyExpenses: 1250,
          recentTransactions: [
            { id: 1, date: new Date(), description: 'Starbucks Coffee', amount: -5.50, categoryName: 'Food' },
            { id: 2, date: new Date(), description: 'Monthly Salary', amount: 4500, categoryName: 'Income' },
            { id: 3, date: new Date(), description: 'Apartment Rent', amount: -1200, categoryName: 'Housing' }
          ]
        };
      }
    });
  }
}
