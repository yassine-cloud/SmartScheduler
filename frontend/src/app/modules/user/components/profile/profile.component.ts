import { Component } from '@angular/core';
import { IUser, Role, Status } from '../../../../models/iuser';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageUploadDialogComponent } from '../image-upload-dialog/image-upload-dialog.component';
import { ProfileUpdateDialogComponent } from '../profile-update-dialog/profile-update-dialog.component';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user: IUser = {
    firstName: 'John',
    lastName: 'Doe',
    contact: '123-456-789',
    email: 'john.doe@example.com',
    role: Role.user,
    status: Status.active,
    image: 'assets/default-profile.jpg', // default profile image path
  };

  profileForm: FormGroup;

  constructor(private readonly dialog: MatDialog, private readonly fb: FormBuilder, private readonly authService: AuthService, private readonly router: Router, private readonly profileService: ProfileService) {
    this.profileForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      contact: [null, [Validators.required, Validators.pattern('[0-9]+')]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [this.passwordStrengthValidator]],
      confirmPassword: [null],
    },
    { validators: [this.passwordMatchValidator] }
  );
    
  }

  ngOnInit(){
    if (!this.authService.currentUser()) {
      this.router.navigate(['/login']);

    }
    this.user = this.authService.currentUser()!;

    this.profileForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      contact: this.user.contact,
      email: this.user.email,
    });
  }

  openImageDialog(): void {
    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
      data: { image: this.user.image },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.profileService.updateImage(result).subscribe({
          next: updatedUser => {
            if (updatedUser) {
              this.user = updatedUser.user;
            }
          }
        });
      }
    });
  }

  openProfileUpdateDialog(): void {
    const dialogRef = this.dialog.open(ProfileUpdateDialogComponent, {
      data: { user: this.user },
    });

    dialogRef.afterClosed().subscribe(updatedUser => {
      if (updatedUser) {
        this.profileService.updateProfile(updatedUser).subscribe({
          next: response => {
            if (response) {
              this.user = response.user;
            }
          }
        });
      }
    });
  }

  // Validator for password strength
  passwordStrengthValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = control.value;


    // If password is not provided, return null (no validation needed)
    if (!password) {
      return null;
    }

    // Regex: At least one uppercase, one lowercase, one digit, one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

    if (password && !passwordRegex.test(password)) {
      return { passwordWeak: true };
    }
    return null;
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
  
    if (password && confirmPassword) {
      if (password.value && confirmPassword.value !== password.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPassword.setErrors(null); // Clear error if passwords match
      }
    }
    return null;
  }
}
