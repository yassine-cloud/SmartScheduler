import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '../../../models/iuser';
import { IProjectMember } from '../../../models/iproject-member';

@Injectable({
  providedIn: 'root'
})
export class ProjectMemberService {

  http = inject(HttpClient);
    router = inject(Router);
    auth = inject(AuthService);
    private readonly _snackBar = inject(MatSnackBar);
  
    apiUrl = environment.apiUrl;

    getAllProjectMembersforProject(projectId: string) {
      return this.http.get<IUser[]>(`${this.apiUrl}/users/project/${projectId}`);
    }

    addProjectMember(projectMember : IProjectMember) {
      return this.http.post(`${this.apiUrl}/project-members`, { projectMember });
    }

    updateProjectMember(projectMember: IProjectMember) {
      return this.http.put(`${this.apiUrl}/project-members/${projectMember.id}`, projectMember);
    }

    deleteProjectMember(id: string) {
      return this.http.delete(`${this.apiUrl}/project-members/${id}`);
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
