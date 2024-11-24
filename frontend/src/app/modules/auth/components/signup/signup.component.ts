import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm!: FormGroup;
  hidePassword = true;
  selectedFile!: File;
  imageSrc: string | null = null;
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

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.imageError = false;

      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imageError = true;
      this.imageSrc = null;
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

    this.authService.register(formData).subscribe();
  }
}
