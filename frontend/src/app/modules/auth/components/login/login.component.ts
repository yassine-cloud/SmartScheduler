import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
// import { StorageService } from '../../storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,  private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    // console.log(this.loginForm.value);
  
    this.authService.login(this.loginForm.value)
    .subscribe();
    // .subscribe((res) => {
    //   console.log(res);
  
    //   if (res.user.id != null) {
       
    //     const user = {
    //       id: res.user.id,
    //       role: res.user.role
    //     };
  
    //     StorageService.saveUser(user);
    //     StorageService.saveToken(res.token);

    //     if (StorageService.isAdminLoggedIn()) {
    //       this.router.navigateByUrl("/admin");
    //     } else if (StorageService.isEmployeeLoggedIn()) {
    //       this.router.navigateByUrl("/employee");
    //     }
  
    //     this.snackbar.open("Login successful", "Close", { duration: 5000 });
    //   } else {
 
    //     this.snackbar.open("Invalid credentials", "Close", {
    //       duration: 5000,
    //       panelClass: "error-snackbar"
    //     });
    //   }
    // });
  }
  
}
