import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup;
  hidePassword = true;
  selectedFile!: File;
  imageError: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService,
              private snackbar: MatSnackBar, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      contact: [null, [Validators.required]],  
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.imageError = false;
    } else {
      this.imageError = true;
    }
  }

  onSubmit() {
    if (this.signupForm.invalid || !this.selectedFile) {
      this.snackbar.open("Please fill in all required fields correctly", "Close", { duration: 5000, panelClass: "error-snackbar" });
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.signupForm.get('firstName')?.value);
    formData.append('lastName', this.signupForm.get('lastName')?.value);
    formData.append('email', this.signupForm.get('email')?.value);
    formData.append('password', this.signupForm.get('password')?.value);
    formData.append('contact', this.signupForm.get('contact')?.value);
    formData.append('image', this.selectedFile);  

    this.authService.signup(formData).subscribe({
      next: (res) => {
        if (res.token) {
          this.snackbar.open("Signup successful", "Close", { duration: 5000 });
          this.router.navigateByUrl("/login");
        } else {
          this.snackbar.open("Signup failed. Try again!", "Close", { duration: 5000, panelClass: "error-snackbar" });
        }
      },
      error: (err) => {
        this.snackbar.open("An error occurred during signup.", "Close", { duration: 5000, panelClass: "error-snackbar" });
      }
    });
  }
}
