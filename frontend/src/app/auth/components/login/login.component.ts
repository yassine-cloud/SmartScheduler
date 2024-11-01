import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  hidePassword =true;
  constructor(private fb:FormBuilder)
  {
     this.loginForm=this.fb.group({

      email :[null,[Validators.required,Validators.email]],
      password:[null,[Validators.required]],

     })
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
}
  onSubmit(){
    console.log(this.loginForm.value);
  }
}
