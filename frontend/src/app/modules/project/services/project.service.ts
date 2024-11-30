import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth/auth.service';
import { IProject } from '../../../models/iproject';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  http = inject(HttpClient);
  router = inject(Router);
  auth = inject(AuthService);
  private readonly _snackBar = inject(MatSnackBar);

  apiUrl = environment.apiUrl;

  getAllProjectsforUser() {
    return this.http.get<IProject[]>(`${this.apiUrl}/projects/user/${this.auth.currentUser()?.id}`);
  }

  getProjectById(id: string) {
    return this.http.get<IProject >(`${this.apiUrl}/projects/${id}`);
  }

  addProject(project: IProject) {
    return this.http.post<IProject >(`${this.apiUrl}/projects`, project);
  }

  updateProject(project: IProject) {
    return this.http.put<IProject >(`${this.apiUrl}/projects/${project.id}`, project);
  }

  deleteProject(id: string) {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/projects/${id}`);
  }


  private openSnackBar(message: string) {
    this._snackBar.open(message, "Close", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 10000,
    }
    );
  }
}
