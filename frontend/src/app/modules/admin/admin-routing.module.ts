import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/users/list-users/admin.component';
import { UserFormDialogComponent } from './components/users/user-form-dialog/user-form-dialog.component';
import { PostTaskComponent } from './components/post-task/post-task.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'add-user', component: UserFormDialogComponent },
  { path: '', component: AdminComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'task', component: PostTaskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
