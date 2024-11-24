import { Component } from '@angular/core';
import { EmailValidationService } from '../../services/email-validation.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resend-validation-email',
  templateUrl: './resend-validation-email.component.html',
  styleUrl: './resend-validation-email.component.scss'
})
export class ResendValidationEmailComponent {
  

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly emailValidationService: EmailValidationService
  ) {}

  email = '';

  ngOnInit() {

    this.route.paramMap.subscribe((params) => {
      this.email = params.get('email') ?? ''; // Fallback to empty string if email is null
    });
    if (this.email !== '') {
      // this.router.navigate(['/login']);
    }
  }




  resendValidation() {
    this.emailValidationService.resendValidationEmail(this.email).subscribe();
  }

}
