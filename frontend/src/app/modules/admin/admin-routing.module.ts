import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin.component';
import { UserFormDialogComponent } from './components/user-form-dialog/user-form-dialog.component';

const routes: Routes = [
  { path: 'add-user', component: UserFormDialogComponent },
  { path: '', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
