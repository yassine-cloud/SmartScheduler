import { Component, inject } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';
import { StorageService } from './modules/auth/storage/storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Smart Scheduler';
  authService = inject(AuthService);
  isEmployeeLoggedIn: boolean = StorageService.isEmployeeLoggedIn();
  isAdminLoggedIn: boolean = StorageService.isAdminLoggedIn();

  constructor(private router: Router) {
    this.authService.checkAuth();
  }
  
  ngOnInit() {
  this.router.events.subscribe(event => {
  this.isEmployeeLoggedIn = StorageService.isEmployeeLoggedIn();
  this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
  
  })
  }
  logout() {
    StorageService.logout();
    this.router.navigateByUrl("/login");
  }

}
