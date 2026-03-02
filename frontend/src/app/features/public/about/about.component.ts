import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    
    <main class="py-5">
      <div class="container py-5">
        <div class="row align-items-center mb-5">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">Our Mission</h1>
            <p class="lead">At WealthWise, we believe that everyone deserves the tools to achieve financial freedom. Our mission is to simplify personal finance management through intuitive design and powerful technology.</p>
            <p class="text-muted">Founded in 2024, we've helped thousands of users across the globe take control of their spending, save millions, and build a more secure future for themselves and their families.</p>
          </div>
          <div class="col-lg-6">
            <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Team Work" class="img-fluid rounded-4 shadow">
          </div>
        </div>

        <div class="row g-4 mt-5">
          <div class="col-md-4 text-center">
            <div class="p-4 bg-white rounded-4 shadow-sm h-100">
               <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 50px; height: 50px;">
                  <i class="bi bi-shield-check fs-4"></i>
               </div>
               <h5 class="fw-bold">Security First</h5>
               <p class="text-muted">Your data is encrypted and protected with industry-leading security standards.</p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="p-4 bg-white rounded-4 shadow-sm h-100">
               <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 50px; height: 50px;">
                  <i class="bi bi-lightning-charge fs-4"></i>
               </div>
               <h5 class="fw-bold">Real-time Insights</h5>
               <p class="text-muted">See where your money goes instantly with live updates and smart categorization.</p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="p-4 bg-white rounded-4 shadow-sm h-100">
               <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 50px; height: 50px;">
                  <i class="bi bi-people fs-4"></i>
               </div>
               <h5 class="fw-bold">Built for You</h5>
               <p class="text-muted">Designed to be simple enough for anyone, yet powerful enough for financial experts.</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <app-footer></app-footer>
  `
})
export class AboutComponent {}
