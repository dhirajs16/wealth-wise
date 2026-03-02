import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../core/services/finance.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NgxChartsModule } from 'ngx-charts';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, NgxChartsModule],
  template: `
    <app-navbar></app-navbar>

    <main class="py-4 bg-light min-vh-100">
      <div class="container">
        <div class="row mb-4 align-items-center">
          <div class="col-md-6">
            <h2 class="fw-bold mb-1">Financial Reports</h2>
            <p class="text-muted mb-0">Deep dive into your spending and income</p>
          </div>
          <div class="col-md-6 text-md-end mt-3 mt-md-0 d-flex justify-content-md-end gap-2">
            <div class="input-group" style="width: auto;">
              <select [(ngModel)]="currentMonth" (change)="loadReports()" class="form-select border-0 shadow-sm">
                 <option *ngFor="let m of months; let i = index" [value]="i+1">{{ m }}</option>
              </select>
              <select [(ngModel)]="currentYear" (change)="loadReports()" class="form-select border-0 shadow-sm">
                 <option *ngFor="let y of years" [value]="y">{{ y }}</option>
              </select>
            </div>
            <button class="btn btn-outline-primary px-4 shadow-sm">
              <i class="bi bi-file-earmark-pdf me-2"></i>Export PDF
            </button>
          </div>
        </div>

        <div class="row g-4">
          <!-- Spending by Category (Pie Chart) -->
          <div class="col-lg-6">
            <div class="card p-4 border-0 shadow-sm h-100">
              <h5 class="fw-bold mb-4">Spending by Category</h5>
              <div class="chart-container" style="height: 350px;">
                <ngx-charts-pie-chart
                  [results]="pieData"
                  [scheme]="colorScheme"
                  [legend]="true"
                  [labels]="true"
                  [doughnut]="true"
                  [animations]="true">
                </ngx-charts-pie-chart>
              </div>
            </div>
          </div>

          <!-- Income vs Expenses (Bar Chart) -->
          <div class="col-lg-6">
            <div class="card p-4 border-0 shadow-sm h-100">
              <h5 class="fw-bold mb-4">Income vs Expenses</h5>
              <div class="chart-container" style="height: 350px;">
                <ngx-charts-bar-vertical-2d
                  [results]="barData"
                  [scheme]="colorScheme"
                  [xAxis]="true"
                  [yAxis]="true"
                  [legend]="true"
                  [showXAxisLabel]="false"
                  [showYAxisLabel]="false"
                  [animations]="true">
                </ngx-charts-bar-vertical-2d>
              </div>
            </div>
          </div>

          <!-- Net Worth Trend (Area Chart) -->
          <div class="col-12">
            <div class="card p-4 border-0 shadow-sm">
              <h5 class="fw-bold mb-4">Net Worth Projection</h5>
              <div class="chart-container" style="height: 300px;">
                <ngx-charts-line-chart
                  [results]="lineData"
                  [scheme]="colorScheme"
                  [xAxis]="true"
                  [yAxis]="true"
                  [legend]="false"
                  [showXAxisLabel]="false"
                  [showYAxisLabel]="false"
                  [animations]="true">
                </ngx-charts-line-chart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <app-footer></app-footer>
  `,
  styles: [`
    .chart-container { width: 100%; position: relative; }
  `]
})
export class ReportsComponent implements OnInit {
  private financeService = inject(FinanceService);

  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years = [2023, 2024, 2025];

  pieData: any[] = [];
  barData: any[] = [];
  lineData: any[] = [];

  colorScheme: any = {
    domain: ['#1e3a8a', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6']
  };

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.financeService.getSpendingByCategory(this.currentYear, this.currentMonth).subscribe({
      next: (res) => this.pieData = res,
      error: () => {
         // Mock
         this.pieData = [
            { name: 'Food', value: 450 },
            { name: 'Rent', value: 1200 },
            { name: 'Commute', value: 150 },
            { name: 'Fun', value: 200 }
         ];
      }
    });

    // Mock bar and line data
    this.barData = [
      {
        "name": "January",
        "series": [
          { "name": "Income", "value": 4000 },
          { "name": "Expenses", "value": 2500 }
        ]
      },
      {
        "name": "February",
        "series": [
          { "name": "Income", "value": 4200 },
          { "name": "Expenses", "value": 3100 }
        ]
      }
    ];

    this.lineData = [
      {
        "name": "Net Worth",
        "series": [
          { "name": "Jan", "value": 10000 },
          { "name": "Feb", "value": 11500 },
          { "name": "Mar", "value": 12400 },
          { "name": "Apr", "value": 14000 }
        ]
      }
    ];
  }
}
