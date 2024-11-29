import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordService } from '../../services/reset-password.service';
import { ScrollService } from '../../../../core/services/scroll/scroll.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly passwordResetService: ResetPasswordService,
    private readonly scrollService: ScrollService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {
    this.scrollService.scrollToHideNavbar();
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.passwordResetService.sendResetLink(email).subscribe();
    }
  }

}
