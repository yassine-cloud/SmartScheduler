import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  listOfTasks: any = [];
  filteredTasks: any = [];
  searchQuery: string = '';
  selectedStatus: string = '';
  selectedPriority: string = '';
  pageSize: number = 5;
  pageIndex: number = 0;
  length: number = 0;

  ngOnInit() {
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
    ];
    this.applyFilters(); // Apply filters on initialization
  }

  constructor(private service: EmployeeService) {
    this.getTasks();
  }

  getTasks() {
    this.service.getTask().subscribe((res: any) => {
      this.listOfTasks = res;
      this.length = this.listOfTasks.length; 
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredTasks = this.listOfTasks.filter((task: any) => {
      const searchTerm = this.searchQuery.toLowerCase();

      // Filter by search query (task title or employee name)
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm) || task.employeeName.toLowerCase().includes(searchTerm);

      // Filter by status if selected
      const matchesStatus = this.selectedStatus ? task.taskStatus === this.selectedStatus : true;

      // Filter by priority if selected
      const matchesPriority = this.selectedPriority ? task.priority === this.selectedPriority : true;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    this.updatePagination();
  }

  updatePagination() {
    this.filteredTasks = this.filteredTasks.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  // Placeholder functions for the action buttons
  onViewTask(taskId: number) {
    console.log('Viewing task with ID:', taskId);
  }

  onUpdateTask(taskId: number) {
    console.log('Updating task with ID:', taskId);
  }

  onDeleteTask(taskId: number) {
    console.log('Deleting task with ID:', taskId);
  }
}
