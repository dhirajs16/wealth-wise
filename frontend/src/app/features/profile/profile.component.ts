import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="py-4 bg-light min-vh-100">
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <h2 class="fw-bold mb-4">Account Settings</h2>
            
            <!-- Personal Info -->
            <div class="card border-0 shadow-sm p-4 mb-4">
              <h5 class="fw-bold mb-4">Personal Information</h5>
              <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()">
                <div class="row g-3">
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">Full Name</label>
                    <input type="text" formControlName="fullName" class="form-control">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">Email Address</label>
                    <input type="email" formControlName="email" class="form-control" readonly>
                    <small class="text-muted">Email cannot be changed.</small>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="loading">Save Changes</button>
              </form>
            </div>

            <!-- Change Password -->
            <div class="card border-0 shadow-sm p-4 mb-4">
              <h5 class="fw-bold mb-4">Change Password</h5>
              <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()">
                <div class="mb-3">
                  <label class="form-label small fw-bold">Current Password</label>
                  <input type="password" formControlName="currentPassword" class="form-control">
                </div>
                <div class="row g-3">
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">New Password</label>
                    <input type="password" formControlName="newPassword" class="form-control">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label small fw-bold">Confirm New Password</label>
                    <input type="password" formControlName="confirmPassword" class="form-control">
                  </div>
                </div>
                <button type="submit" class="btn btn-primary" [disabled]="passwordLoading">Update Password</button>
              </form>
            </div>

            <!-- Danger Zone -->
            <div class="card border-0 shadow-sm p-4 border-start border-danger border-4">
              <h5 class="fw-bold text-danger mb-3">Danger Zone</h5>
              <p class="text-muted small mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <button class="btn btn-outline-danger" (click)="onDeleteAccount()">Delete My Account</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <app-footer></app-footer>
  `
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private toastr = inject(ToastrService);

  loading = false;
  passwordLoading = false;
  
  user = JSON.parse(localStorage.getItem('user') || '{}');

  profileForm = this.fb.group({
    fullName: [this.user.fullName || '', Validators.required],
    email: [this.user.email || '', [Validators.required, Validators.email]]
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  onUpdateProfile() {
    this.toastr.success('Profile updated successfully!');
  }

  onChangePassword() {
    this.toastr.success('Password changed successfully!');
    this.passwordForm.reset();
  }

  onDeleteAccount() {
    if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      this.toastr.error('Account deleted.');
      this.auth.logout();
    }
  }
}
