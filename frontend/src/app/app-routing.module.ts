import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { SignupComponent } from './modules/auth/components/signup/signup.component';
import { NgModule } from '@angular/core';
import { ValidateEmailComponent } from './modules/auth/components/validate-email/validate-email.component';
import { ResendValidationEmailComponent } from './modules/auth/components/resend-validation-email/resend-validation-email.component';

export const routes: Routes = [
{path:"login",component:LoginComponent},
{path:"signup",component:SignupComponent},
{path : "verify/:token", component:ValidateEmailComponent},
{path : "resend-validation/:email", component: ResendValidationEmailComponent},
{path:"admin",loadChildren:()=>import("./modules/admin/admin.module").then(e => e.AdminModule)},
{path:"employee",loadChildren:()=>import("./modules/employee/employee.module").then(e => e.EmployeeModule)},
{path:"**",redirectTo:"login"}

];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule { }
