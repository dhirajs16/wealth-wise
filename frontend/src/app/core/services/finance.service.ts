import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private api = inject(ApiService);

  // Accounts
  getAccounts(): Observable<any[]> {
    return this.api.get('/accounts');
  }

  createAccount(data: any): Observable<any> {
    return this.api.post('/accounts', data);
  }

  deleteAccount(id: number): Observable<any> {
    return this.api.delete(`/accounts/${id}`);
  }

  // Transactions
  getTransactions(filters: any = {}): Observable<any[]> {
    return this.api.get('/transactions', filters);
  }

  createTransaction(data: any): Observable<any> {
    return this.api.post('/transactions', data);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.api.delete(`/transactions/${id}`);
  }

  importTransactions(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post('/transactions/import', formData);
  }

  // Categories
  getCategories(): Observable<any[]> {
    return this.api.get('/categories');
  }

  // Budgets
  getBudgets(year: number, month: number): Observable<any[]> {
    return this.api.get('/budgets', { year, month });
  }

  upsertBudget(data: any): Observable<any> {
    return this.api.post('/budgets', data);
  }

  // Goals
  getGoals(): Observable<any[]> {
    return this.api.get('/goals');
  }

  createGoal(data: any): Observable<any> {
    return this.api.post('/goals', data);
  }

  updateGoal(id: number, data: any): Observable<any> {
    return this.api.put(`/goals/${id}`, data);
  }

  deleteGoal(id: number): Observable<any> {
    return this.api.delete(`/goals/${id}`);
  }

  // Reports
  getDashboardSummary(): Observable<any> {
    return this.api.get('/reports/summary');
  }

  getSpendingByCategory(year: number, month: number): Observable<any[]> {
    return this.api.get('/reports/spending-by-category', { year, month });
  }
}
