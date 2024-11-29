import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth/auth.service';
import { IUser } from '../../../models/iuser';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  http = inject(HttpClient);
  router = inject(Router);
  auth = inject(AuthService);
  private readonly _snackBar = inject(MatSnackBar);

  apiUrl = environment.apiUrl;

  updateImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);

    return this.http
      .put<{ message: string, user : IUser }>(`${this.apiUrl}/users/${this.auth.currentUser()?.id}/image`, formData)
      .pipe(
        tap((response) => {
          this.auth.currentUser.set(response.user);
          this.openSnackBar('Image updated successfully');
        }),
        catchError((error) => {
          this.openSnackBar('Failed to update image');
          return of(null);
        })
      );
  }

  updateProfile(user: IUser) {
    return this.http
      .put<{ message: string, user : IUser }>(`${this.apiUrl}/users/${this.auth.currentUser()?.id}`, user)
      .pipe(
        tap((response) => {
          this.auth.currentUser.set(response.user);
          this.openSnackBar('Profile updated successfully');
        }),
        catchError((error) => {
          this.openSnackBar('Failed to update profile');
          return of(null);
        })
      );
  }




  private openSnackBar(message: string) {
    this._snackBar.open(message, "Close", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10000,
    }
    );
  }

}
