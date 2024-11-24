import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailValidationService } from '../../services/email-validation.service';

@Component({
  selector: 'app-validate-email',
  templateUrl: './validate-email.component.html',
  styleUrl: './validate-email.component.scss'
})
export class ValidateEmailComponent {

  verificationStatus: 'success' | 'failed' | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly emailValidationService: EmailValidationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const token = params.get('token') ?? ''; // Fallback to empty string if email is null
      if (token) {
        this.emailValidationService.verifyEmail(token).subscribe(
          (res) => {
            if (res)
              this.verificationStatus = 'success';
            else
              this.verificationStatus = 'failed';
          }
        );
      } else {
        this.verificationStatus = 'failed';
      }
    });
    
  }

}
