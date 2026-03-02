import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-dark text-light py-5 mt-auto">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4">
            <h5 class="fw-bold mb-3">WealthWise</h5>
            <p class="text-muted">Take control of your financial future with smart tracking and powerful insights.</p>
            <div class="d-flex gap-3 mt-3">
              <a href="#" class="text-light fs-5"><i class="bi bi-facebook"></i></a>
              <a href="#" class="text-light fs-5"><i class="bi bi-twitter-x"></i></a>
              <a href="#" class="text-light fs-5"><i class="bi bi-linkedin"></i></a>
              <a href="#" class="text-light fs-5"><i class="bi bi-instagram"></i></a>
            </div>
          </div>
          <div class="col-md-2">
            <h6 class="fw-bold mb-3">Company</h6>
            <ul class="list-unstyled text-muted">
              <li class="mb-2"><a routerLink="/about" class="text-decoration-none text-muted">About Us</a></li>
              <li class="mb-2"><a routerLink="/contact" class="text-decoration-none text-muted">Contact</a></li>
              <li class="mb-2"><a href="#" class="text-decoration-none text-muted">Careers</a></li>
            </ul>
          </div>
          <div class="col-md-3">
            <h6 class="fw-bold mb-3">Support</h6>
            <ul class="list-unstyled text-muted">
              <li class="mb-2"><a href="#" class="text-decoration-none text-muted">Help Center</a></li>
              <li class="mb-2"><a href="#" class="text-decoration-none text-muted">Privacy Policy</a></li>
              <li class="mb-2"><a href="#" class="text-decoration-none text-muted">Terms of Service</a></li>
            </ul>
          </div>
          <div class="col-md-3">
            <h6 class="fw-bold mb-3">Newsletter</h6>
            <p class="small text-muted mb-3">Get the latest financial tips delivered to your inbox.</p>
            <div class="input-group">
              <input type="email" class="form-control" placeholder="Email address">
              <button class="btn btn-primary" type="button">Join</button>
            </div>
          </div>
        </div>
        <hr class="my-4 border-secondary">
        <div class="text-center text-muted small">
          &copy; {{ currentYear }} WealthWise. All rights reserved.
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer { border-top: 1px solid #333; }
    h5, h6 { color: #fff; }
    a:hover { color: var(--primary-color) !important; }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
