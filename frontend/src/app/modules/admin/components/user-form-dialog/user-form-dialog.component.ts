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
      id: [data ? data.id : '', Validators.required],
      firstName: [data ? data.firstName : '', Validators.required],
      lastName: [data ? data.lastName : '', Validators.required],
      email: [data ? data.email : '', [Validators.required, Validators.email]],
      contact: [data ? data.contact : '', Validators.required],
      role: [data ? data.role : 'user', Validators.required],
      status: [data ? data.status : 'active', Validators.required]
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
