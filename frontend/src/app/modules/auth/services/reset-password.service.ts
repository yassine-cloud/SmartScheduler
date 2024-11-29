import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { catchError, of, tap } from 'rxjs';
import { IUser } from '../../../models/iuser';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  http = inject(HttpClient);
  router = inject(Router);
  private readonly _snackBar = inject(MatSnackBar);

  apiUrl = environment.apiUrl;

  sendResetLink(email: string) {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/reset-password`, { email })
      .pipe(
        tap((response) => {
          this.openSnackBar("A reset link has been sent to your email address.");
          this.router.navigate(['/login']);
        }),
        catchError((error) => {
          if (error.status == 500) {
            this.openSnackBar("Failed to send reset link. Please try again later.");
            return of(null);
          }
          else {
          this.openSnackBar("A reset link has been sent to your email address.");
          this.router.navigate(['/login']);
          return of(null);
          }
        })
      );
  }

  resetPassword(token: string, password: string) {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/reset-password/${token}`, { password })
      .pipe(
        tap((response) => {
          this.openSnackBar("Password reset successfully.");
          this.router.navigate(['/login']);
        }),
        catchError((error) => {
          if (error.status == 500) {
            this.openSnackBar("Failed to reset password. Please try again later.");
            return of(null);
          }
          else {
          this.openSnackBar("Failed to reset password. Please verify the informations.");
          this.router.navigate(['/login']);
          return of(null);
          }
        })
      );
  }

  getPublicUserInfoFromToken(token: string) {
    return this.http
      .get<{ user : IUser }>(`${this.apiUrl}/reset-password/${token}`)
      .pipe(
        tap((response) => {
          return response.user;
        }),
        catchError((error) => {
          if (error.status == 500) {
            this.openSnackBar("Failed to load. Please try again later.");
          }
          else {
          this.openSnackBar("invalid or expired token.");
          }
          this.router.navigate(['/login']);
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
