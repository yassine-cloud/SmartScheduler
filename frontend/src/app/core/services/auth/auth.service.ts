import { inject, Injectable, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { IUser } from '../../../models/iuser';
import { IUserLogin } from '../../../models/iuser-login';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  apiUrl = environment.apiUrl;
  currentUser = signal<IUser | undefined | null>(undefined);


  apiCheckUser = `${this.apiUrl}/user` ;
  apiRegister = `${this.apiUrl}/register` ;
  apiLogin = `${this.apiUrl}/login`;

  checkAuth() {
    return this.http
      .get<{ message: string, user: IUser }>(this.apiCheckUser)
      .subscribe({          
         next: (response) => {
        console.log(response);
        this.currentUser.set(response.user);
        },
        error: (error) => {
          this.currentUser.set(null);
        }
      });
  }

  login(user: IUserLogin) {

    return this.http
      .post<{ token: string; user: IUser }>(this.apiLogin, user)
      .pipe(
        tap((response) => {
          console.log(response);
          localStorage.setItem('token', response.token);
          this.currentUser.set(response.user);
          this.router.navigate(['/']);
        }),
        catchError(this.handleError) 
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.openSnackBar('Logged out');
    this.router.navigate(['/login']);
  }

  register(user: FormData) {
    
    const requiredFields = ['firstName', 'lastName', 'contact', 'email'];
    
    for (const field of requiredFields) {
      if (!user.has(field) || !user.get(field)) {
        console.log(`Form data is not valid: Missing or empty field "${field}"`);
        return throwError(`Form data is not valid: Missing or empty field "${field}"`);
      }
    }
    return this.http
      .post<{token: string, user: IUser}>(this.apiRegister, user)
      .pipe(
        tap((response) => {
          console.log(response);
          localStorage.setItem('token', response.token);
          this.currentUser.set(response.user);
          this.router.navigate(['/']);
        }),
        catchError(this.handleError)
      )      
  }


  handleError(error: any) {
    if (error.status === 409) {
  
      return throwError('Email already exists. Please use a different email.');
    }
    return throwError('An error occurred. Please try again later.');
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
