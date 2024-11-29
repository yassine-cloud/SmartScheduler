import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  listOfTasks: any = [];

  ngOnInit() {
    // Example data to test the table before connecting to XAMPP or a backend
    this.listOfTasks = [
      {
        title: 'Complete Project Proposal',
        description: 'Write and submit the project proposal by the deadline.',
        dueDate: new Date('2024-12-05'),
        employeeName: 'John Doe',
        priority: 'High',
        taskStatus: 'In Progress'
      },
      {
        title: 'Client Meeting',
        description: 'Attend the meeting with the client to discuss project requirements.',
        dueDate: new Date('2024-12-10'),
        employeeName: 'Jane Smith',
        priority: 'Medium',
        taskStatus: 'Pending'
      }
    ]}

  constructor(private service: AdminService) {
    this.getTasks();
  }
  getTasks() {
    this.service.getTask().subscribe((res: any) => {
      this.listOfTasks = res;
    });
  }
}
