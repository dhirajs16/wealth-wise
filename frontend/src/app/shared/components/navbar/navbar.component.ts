import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">
          <i class="bi bi-piggy-bank-fill me-2"></i>WealthWise
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" *ngIf="!auth.isLoggedIn()">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            </li>
            <li class="nav-item" *ngIf="!auth.isLoggedIn()">
              <a class="nav-link" routerLink="/about" routerLinkActive="active">About</a>
            </li>
            <li class="nav-item" *ngIf="!auth.isLoggedIn()">
              <a class="nav-link" routerLink="/contact" routerLinkActive="active">Contact</a>
            </li>
            <li class="nav-item" *ngIf="auth.isLoggedIn()">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            </li>
            <li class="nav-item" *ngIf="auth.isLoggedIn()">
              <a class="nav-link" routerLink="/transactions" routerLinkActive="active">Transactions</a>
            </li>
            <li class="nav-item" *ngIf="auth.isLoggedIn()">
              <a class="nav-link" routerLink="/accounts" routerLinkActive="active">Accounts</a>
            </li>
            <li class="nav-item" *ngIf="auth.isLoggedIn()">
              <a class="nav-link" routerLink="/budgets" routerLinkActive="active">Budgets</a>
            </li>
            <li class="nav-item" *ngIf="auth.isLoggedIn()">
              <a class="nav-link" routerLink="/goals" routerLinkActive="active">Goals</a>
            </li>
            <li class="nav-item" *ngIf="auth.isLoggedIn()">
              <a class="nav-link" routerLink="/reports" routerLinkActive="active">Reports</a>
            </li>
          </ul>
          <div class="d-flex align-items-center">
            <ng-container *ngIf="!auth.isLoggedIn()">
              <a routerLink="/login" class="btn btn-outline-light me-2">Login</a>
              <a routerLink="/register" class="btn btn-light text-primary fw-bold">Sign Up</a>
            </ng-container>
            <div class="dropdown" *ngIf="auth.isLoggedIn()">
              <button class="btn btn-primary dropdown-toggle d-flex align-items-center" type="button" id="userMenu" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-2 fs-5"></i>
                <span>{{ (auth.currentUser$ | async)?.fullName }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                <li><a class="dropdown-item" routerLink="/profile"><i class="bi bi-person me-2"></i>Profile</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" (click)="logout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { padding: 0.75rem 0; }
    .nav-link { font-weight: 500; margin: 0 0.5rem; transition: color 0.2s; }
    .dropdown-item { padding: 0.75rem 1.25rem; }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
