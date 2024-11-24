import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { catchError, map, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailValidationService {

  http = inject(HttpClient);
  router = inject(Router);
  private readonly _snackBar = inject(MatSnackBar);

  apiUrl = environment.apiUrl;


  verifyEmail(token: string) {
    return this.http
      .get<{ message: string }>(`${this.apiUrl}/verify/${token}`)
      .pipe(
        map((response) => {
          this.openSnackBar(response.message);
          return true;
        }),
        catchError((error) => {
          
          this.openSnackBar(error.error.message);
          return of(false);
        })
      )
      // .subscribe({
      //   next: (response) => {
      //     this.openSnackBar(response.message);
      //     this.router.navigate(['/login']);
      //   },
      //   error: (error) => {
      //     this.openSnackBar(error.error.message);
          
      //   }
      // });
  }

  resendValidationEmail(email: string) {
    console.log(email);
    return this.http
      .get<{ message: string }>(`${this.apiUrl}/verify/resend/${email}`)
      .pipe(
        tap((response) => {
          this.openSnackBar(response.message);
          this.router.navigate(['/login']);
        }),
        catchError((error) => {
          if (error.status == 400) {
            this.openSnackBar('User not found');
            return throwError(() => new Error('User not found'));
          }
          else if(error.status == 405){
            this.openSnackBar('User already verified');
            return throwError(() => new Error('User already verified'));
          }
          else if(error.status == 406){
            this.openSnackBar('Verification email already sent.');
            return throwError(() => new Error('Verification email already sent.'));
          }
          this.openSnackBar("An error occurred. Please try again later. Or contact support.");
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
