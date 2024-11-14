import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss']
})
export class UserFormDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      id: [data.user ? data.user.id : '', Validators.required],
      firstName: [data.user ? data.user.firstName : '', Validators.required],
      lastName: [data.user ? data.user.lastName : '', Validators.required],
      email: [data.user ? data.user.email : '', [Validators.required, Validators.email]],
      contact: [data.user ? data.user.contact : '', Validators.required],
      role: [data.user ? data.user.role : 'user', Validators.required],
      status: [data.user ? data.user.status : 'active', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
