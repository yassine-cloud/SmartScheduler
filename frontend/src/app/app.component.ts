import { Component, inject } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Smart Scheduler';

  authService = inject(AuthService);

  constructor() {
    // Check if user is authenticated
    this.authService.checkAuth();
  }
}
