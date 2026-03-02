import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-register',
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
                <i class="bi bi-person-plus-fill text-primary display-4"></i>
                <h2 class="fw-bold mt-3">Create Account</h2>
                <p class="text-muted">Join WealthWise and start tracking today</p>
              </div>

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label fw-bold small">Full Name</label>
                  <input type="text" formControlName="fullName" class="form-control" [class.is-invalid]="f['fullName'].touched && f['fullName'].errors" placeholder="John Doe">
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold small">Email Address</label>
                  <input type="email" formControlName="email" class="form-control" [class.is-invalid]="f['email'].touched && f['email'].errors" placeholder="email&#64;example.com">
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold small">Password</label>
                  <input type="password" formControlName="password" class="form-control" [class.is-invalid]="f['password'].touched && f['password'].errors" placeholder="••••••••">
                  <!-- Password Strength Placeholder -->
                  <div class="mt-1" *ngIf="f['password'].value">
                    <div class="progress" style="height: 5px;">
                      <div class="progress-bar" [class]="getPasswordStrengthClass()" [style.width]="getPasswordStrength() + '%'"></div>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold small">Confirm Password</label>
                  <input type="password" formControlName="confirmPassword" class="form-control" [class.is-invalid]="f['confirmPassword'].touched && f['confirmPassword'].errors" placeholder="••••••••">
                  <div class="invalid-feedback" *ngIf="f['confirmPassword'].errors?.['passwordMismatch']">Passwords do not match</div>
                </div>

                <button type="submit" class="btn btn-primary btn-lg w-100 py-3 fw-bold mb-4" [disabled]="loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Creating account...' : 'Create Account' }}
                </button>

                <div class="text-center">
                  <p class="mb-0 text-muted">Already have an account? <a routerLink="/login" class="text-primary fw-bold text-decoration-none">Sign In</a></p>
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  loading = false;
  registerForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  get f() { return this.registerForm.controls; }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  getPasswordStrength() {
    const p = this.f['password'].value || '';
    let strength = 0;
    if (p.length >= 6) strength += 25;
    if (/[A-Z]/.test(p)) strength += 25;
    if (/[0-9]/.test(p)) strength += 25;
    if (/[^A-Za-z0-9]/.test(p)) strength += 25;
    return strength;
  }

  getPasswordStrengthClass() {
    const s = this.getPasswordStrength();
    if (s <= 25) return 'bg-danger';
    if (s <= 50) return 'bg-warning';
    if (s <= 75) return 'bg-info';
    return 'bg-success';
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.toastr.success('Your account has been created!', 'Registration Successful');
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error || 'Registration failed', 'Error');
        this.loading = false;
      }
    });
  }
}
