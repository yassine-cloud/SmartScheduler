import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-upload-dialog',
  templateUrl: './image-upload-dialog.component.html',
  styleUrl: './image-upload-dialog.component.scss'
})
export class ImageUploadDialogComponent {

  imageFile: File | null = null;
  selectedImageUrl: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<ImageUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onFileSelected(event: any): void {
    this.imageFile = event.target.files[0];
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageUrl = reader.result;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  save(): void {
    this.dialogRef.close(this.imageFile);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
