import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']  // Fixed styleUrls
})
export class SignupComponent {
  signupForm!: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private authService: AuthService,
              private snackbar: MatSnackBar, private router: Router) {
    this.signupForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  passwordMatchValidator(): void {
    const password = this.signupForm.get('password');
    const confirmPassword = this.signupForm.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onSubmit() {
    this.passwordMatchValidator();  // Call the validator before submission

    if (this.signupForm.invalid) {
      this.snackbar.open("Please fill in all required fields correctly", "Close", { duration: 5000, panelClass: "error-snackbar" });
      return;
    }

    this.authService.signup(this.signupForm.value).subscribe((res) => {
      console.log(res);
      if (res.id != null) {
        this.snackbar.open("Signup successful", "Close", { duration: 5000 });
        this.router.navigateByUrl("/login");
      } else {
        this.snackbar.open("Signup failed. Try again!", "Close", { duration: 5000, panelClass: "error-snackbar" });
      }
    });
  }
}
