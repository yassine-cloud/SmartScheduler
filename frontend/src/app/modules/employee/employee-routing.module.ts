import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostTaskComponent } from './components/post-task/post-task.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'task', component: PostTaskComponent },
  { path: '', component: DashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
