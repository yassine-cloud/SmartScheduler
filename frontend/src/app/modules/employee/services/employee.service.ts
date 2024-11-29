import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}
  
  postTask(taskDTO: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/task`, { taskDTO });
  }
  getTask(): Observable<any> {
    return this.http.get(`${this.apiUrl}/task`);
  }
  getUsers(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.apiUrl}/users`, { headers });
  }
}
