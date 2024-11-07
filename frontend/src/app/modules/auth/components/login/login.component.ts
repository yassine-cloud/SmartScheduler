import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snackbar.open("Please enter a valid email and password", "Close", { duration: 5000, panelClass: "error-snackbar" });
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
     
      next: () => {
        this.snackbar.open("Login successful", "Close", { duration: 5000 });
      },
      error: (error) => {
        console.error(error);
        this.snackbar.open("Login failed. Try again!", "Close", { duration: 5000, panelClass: "error-snackbar" });
      }
    });
  }

}
