import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <main class="d-flex align-items-center py-5 bg-light" style="min-height: calc(100vh - 150px);">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5">
            <div class="card shadow-lg border-0 p-4 p-md-5">
              <div class="text-center mb-4">
                <i class="bi bi-piggy-bank-fill text-primary display-4"></i>
                <h2 class="fw-bold mt-3">Welcome Back</h2>
                <p class="text-muted">Login to manage your finances</p>
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label fw-bold small">Email Address</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-envelope text-muted"></i></span>
                    <input type="email" formControlName="email" class="form-control border-start-0" [class.is-invalid]="f['email'].touched && f['email'].errors" placeholder="email&#64;example.com">
                  </div>
                </div>

                <div class="mb-3">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="form-label fw-bold mb-0 small">Password</label>
                    <a routerLink="/forgot-password" class="small text-decoration-none">Forgot Password?</a>
                  </div>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0"><i class="bi bi-lock text-muted"></i></span>
                    <input [type]="showPassword ? 'text' : 'password'" formControlName="password" class="form-control border-start-0" [class.is-invalid]="f['password'].touched && f['password'].errors" placeholder="••••••••">
                    <button class="btn btn-outline-light border border-start-0 text-muted" type="button" (click)="showPassword = !showPassword">
                      <i class="bi" [class.bi-eye]="!showPassword" [class.bi-eye-slash]="showPassword"></i>
                    </button>
                  </div>
                </div>

                <div class="mb-4 form-check">
                  <input type="checkbox" class="form-check-input" id="rememberMe">
                  <label class="form-check-label small" for="rememberMe">Remember me for 30 days</label>
                </div>

                <button type="submit" class="btn btn-primary btn-lg w-100 py-3 fw-bold mb-4" [disabled]="loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Signing in...' : 'Sign In' }}
                </button>

                <div class="text-center">
                  <p class="mb-0 text-muted">Don't have an account? <a routerLink="/register" class="text-primary fw-bold text-decoration-none">Create Account</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>

    <app-footer></app-footer>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  loading = false;
  showPassword = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        this.toastr.success('Welcome back!', 'Login Successful');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Invalid email or password', 'Login Failed');
        this.loading = false;
      }
    });
  }
}
