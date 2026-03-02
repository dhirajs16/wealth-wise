import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <main>
      <!-- Hero Section -->
      <section class="hero bg-primary text-white py-5">
        <div class="container py-5">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h1 class="display-3 fw-bold mb-4">Master Your Money with WealthWise</h1>
              <p class="lead mb-4 opacity-75">The all-in-one personal finance dashboard that helps you track spending, set budgets, and achieve your financial goals with ease.</p>
              <div class="d-flex gap-3">
                <a routerLink="/register" class="btn btn-light btn-lg text-primary fw-bold px-4 py-3 shadow-sm">Get Started for Free</a>
                <a routerLink="/about" class="btn btn-outline-light btn-lg px-4 py-3">Learn More</a>
              </div>
            </div>
            <div class="col-lg-6 d-none d-lg-block">
              <div class="hero-image-placeholder rounded-4 shadow-lg overflow-hidden border border-light border-opacity-25">
                 <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Dashboard Preview" class="img-fluid">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-5 bg-white">
        <div class="container py-5">
          <div class="text-center mb-5">
            <span class="text-primary fw-bold text-uppercase tracking-wider">Features</span>
            <h2 class="display-5 fw-bold mt-2">Everything you need to succeed</h2>
          </div>
          <div class="row g-4">
            <div class="col-md-3" *ngFor="let feature of features">
              <div class="card h-100 p-4 border-0 bg-light text-center">
                <div class="feature-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4 mx-auto" style="width: 60px; height: 60px;">
                  <i [class]="'bi ' + feature.icon + ' fs-3'"></i>
                </div>
                <h4 class="fw-bold mb-3">{{ feature.title }}</h4>
                <p class="text-muted">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-5 bg-light">
        <div class="container py-5">
          <div class="text-center mb-5">
            <h2 class="display-5 fw-bold">Loved by thousands</h2>
          </div>
          <div class="row g-4">
            <div class="col-md-4" *ngFor="let t of testimonials">
              <div class="card p-4 h-100 shadow-sm border-0">
                <div class="d-flex mb-3 text-warning">
                  <i class="bi bi-star-fill me-1" *ngFor="let i of [1,2,3,4,5]"></i>
                </div>
                <p class="mb-4 fs-5 italic">"{{ t.text }}"</p>
                <div class="d-flex align-items-center">
                  <div class="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    {{ t.name.charAt(0) }}
                  </div>
                  <div>
                    <h6 class="mb-0 fw-bold">{{ t.name }}</h6>
                    <small class="text-muted">{{ t.role }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-5 bg-primary text-white text-center">
        <div class="container py-5">
          <h2 class="display-4 fw-bold mb-4">Ready to take control?</h2>
          <p class="lead mb-4 opacity-75">Join WealthWise today and start your journey towards financial freedom.</p>
          <a routerLink="/register" class="btn btn-light btn-lg text-primary fw-bold px-5 py-3 shadow">Create Your Account</a>
        </div>
      </section>
    </main>

    <app-footer></app-footer>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    }
    .tracking-wider { letter-spacing: 0.1em; }
    .hero-image-placeholder { transform: perspective(1000px) rotateY(-5deg) rotateX(5deg); transition: transform 0.5s; }
    .hero-image-placeholder:hover { transform: perspective(1000px) rotateY(0deg) rotateX(0deg); }
  `]
})
export class HomeComponent {
  features = [
    { title: 'Track Expenses', icon: 'bi-wallet2', description: 'Monitor every cent you spend with automatic categorization and insights.' },
    { title: 'Set Budgets', icon: 'bi-graph-up-arrow', description: 'Create custom budgets for different categories and get alerts before you overspend.' },
    { title: 'Visualize Trends', icon: 'bi-pie-chart-fill', description: 'Beautiful charts help you understand your financial habits over time.' },
    { title: 'Achieve Goals', icon: 'bi-trophy', description: 'Save for what matters most with progress tracking and suggested savings.' }
  ];

  testimonials = [
    { name: 'Sarah J.', role: 'Project Manager', text: 'WealthWise helped me save $5k for my vacation in just 6 months. The interface is so intuitive!' },
    { name: 'Michael K.', role: 'Software Engineer', text: 'The best finance app I have used. The security and reports are top-notch efficiently.' },
    { name: 'Elena R.', role: 'Freelancer', text: 'Finally a dashboard that understands variable income. Highly recommended for everyone!' }
  ];
}
