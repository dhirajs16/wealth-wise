import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <main class="py-5 bg-light">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="card shadow-lg border-0 overflow-hidden">
              <div class="row g-0">
                <div class="col-md-5 bg-primary text-white p-5 d-flex flex-column justify-content-between">
                  <div>
                    <h2 class="fw-bold mb-4">Get in touch</h2>
                    <p class="opacity-75 mb-5">Have questions or feedback? We'd love to hear from you. Fill out the form and our team will get back to you within 24 hours.</p>
                    
                    <ul class="list-unstyled mb-0">
                      <li class="mb-4 d-flex align-items-center text-decoration-none">
                        <i class="bi bi-geo-alt-fill me-3 fs-4"></i>
                        <span>123 Finance Street, New York, NY 10001</span>
                      </li>
                      <li class="mb-4 d-flex align-items-center text-decoration-none">
                        <i class="bi bi-telephone-fill me-3 fs-4"></i>
                        <span>+1 (234) 567-890</span>
                      </li>
                      <li class="mb-0 d-flex align-items-center text-decoration-none">
                        <i class="bi bi-envelope-fill me-3 fs-4"></i>
                        <span>support&#64;wealthwise.com</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div class="d-flex gap-3 mt-5">
                    <a href="#" class="text-white fs-4"><i class="bi bi-facebook"></i></a>
                    <a href="#" class="text-white fs-4"><i class="bi bi-twitter-x"></i></a>
                    <a href="#" class="text-white fs-4"><i class="bi bi-linkedin"></i></a>
                  </div>
                </div>
                
                <div class="col-md-7 p-5 bg-white">
                  <h3 class="fw-bold mb-4 text-dark">Send us a message</h3>
                  <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
                    <div class="mb-3">
                      <label class="form-label small fw-bold">Full Name</label>
                      <input type="text" formControlName="name" class="form-control" [class.is-invalid]="f['name'].touched && f['name'].errors" placeholder="Your name">
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label small fw-bold">Email Address</label>
                      <input type="email" formControlName="email" class="form-control" [class.is-invalid]="f['email'].touched && f['email'].errors" placeholder="your&#64;email.com">
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label small fw-bold">Subject</label>
                      <input type="text" formControlName="subject" class="form-control" [class.is-invalid]="f['subject'].touched && f['subject'].errors" placeholder="How can we help?">
                    </div>
                    
                    <div class="mb-4">
                      <label class="form-label small fw-bold">Message</label>
                      <textarea formControlName="message" class="form-control" rows="4" [class.is-invalid]="f['message'].touched && f['message'].errors" placeholder="Describe your inquiry..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-lg w-100 py-3" [disabled]="loading">
                      <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ loading ? 'Sending...' : 'Send Message' }}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <app-footer></app-footer>
  `
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);

  loading = false;
  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  get f() { return this.contactForm.controls; }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.http.post('https://localhost:5001/api/contact', this.contactForm.value)
      .subscribe({
        next: () => {
          this.toastr.success('Your message has been sent successfully!', 'Success');
          this.contactForm.reset();
          this.loading = false;
        },
        error: () => {
          this.toastr.error('Something went wrong. Please try again later.', 'Error');
          this.loading = false;
        }
      });
  }
}
