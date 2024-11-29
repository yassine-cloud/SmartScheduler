import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../../../../models/iuser';

@Component({
  selector: 'app-profile-update-dialog',
  templateUrl: './profile-update-dialog.component.html',
  styleUrl: './profile-update-dialog.component.scss'
})
export class ProfileUpdateDialogComponent {
  profileForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProfileUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: IUser },
    private readonly fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: [data.user.firstName, Validators.required],
      lastName: [data.user.lastName, Validators.required],
      contact: [data.user.contact, [Validators.required, Validators.pattern('[0-9]+')]],
      email: [data.user.email, [Validators.required, Validators.email]],
      password: [null, [this.passwordStrengthValidator]],
      confirmPassword: [null],
    },
    { validators: [this.passwordMatchValidator] }
  );
  }

  save(): void {
    if (this.profileForm.valid) {
      const updatedUser: IUser = { ...this.data.user, ...this.profileForm.value };
      this.dialogRef.close(updatedUser);
    }
  }

  cancel(): void {
    this.dialogRef.close();
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
