import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from '../../services/reset-password.service';
import { ScrollService } from '../../../../core/services/scroll/scroll.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {
  passwordForm: FormGroup;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  token: string = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly scrollService: ScrollService
  ) {
    this.passwordForm = this.fb.group({
      newPassword: [
        '', 
        [Validators.required, this.passwordStrengthValidator]
      ],
      confirmPassword: ['', Validators.required]
      }, { validators: [this.passwordMatchValidator] }
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
     this.token = params.get('token') ?? '';
    });
    if (this.token === '') {
      this.router.navigate(['/login']);
    }
    this.resetPasswordService.getPublicUserInfoFromToken(this.token).subscribe({
      next: response => {
        if (response){
          this.firstName = response.user.firstName;
          this.lastName = response.user.lastName;
          this.email = response.user.email;
        }
        
      }
    });
  }

  ngAfterViewInit() {
    this.scrollService.scrollToHideNavbar();
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    const { newPassword } = this.passwordForm.value;

    this.resetPasswordService
      .resetPassword(this.token, newPassword)
      .subscribe();
  }

   // Validator for password strength
   passwordStrengthValidator(control: FormControl): { [key: string]: boolean } | null {
    const password = control.value;

    // Regex: At least one uppercase, one lowercase, one digit, one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

    if (password && !passwordRegex.test(password)) {
      return { passwordWeak: true };
    }
    return null;
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
  
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword?.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

}
