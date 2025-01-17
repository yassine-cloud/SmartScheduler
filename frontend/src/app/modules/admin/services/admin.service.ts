import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  modifyUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${user.id}`, user);
  }

  updateUserStatus(userId: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/status`, { status });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }
  postTask(taskDTO: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/task`, { taskDTO });
  }
  getTask(): Observable<any> {
    return this.http.get(`${this.apiUrl}/task`);
  }

}
