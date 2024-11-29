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
  paginatedTasks: any = [];
  selectedPriority: string = '';
  pageSize: number = 3;
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
      },
      {
        title: 'Finish Marketing Plan',
        description: 'Finalize the marketing plan and send it for approval.',
        dueDate: new Date('2024-12-12'),
        employeeName: 'John Doe',
        priority: 'High',
        taskStatus: 'Pending'
      },
      {
        title: 'Website Redesign',
        description: 'Redesign the homepage and add new features as discussed.',
        dueDate: new Date('2024-12-15'),
        employeeName: 'Jane Smith',
        priority: 'Low',
        taskStatus: 'In Progress'
      },
      {
        title: 'Team Building Event',
        description: 'Organize and schedule a team-building activity for the team.',
        dueDate: new Date('2024-12-20'),
        employeeName: 'Alice Brown',
        priority: 'Medium',
        taskStatus: 'Completed'
      },
      {
        title: 'Client Presentation Preparation',
        description: 'Prepare slides and materials for the upcoming client presentation.',
        dueDate: new Date('2024-12-22'),
        employeeName: 'John Doe',
        priority: 'High',
        taskStatus: 'In Progress'
      },
      {
        title: 'Market Research',
        description: 'Conduct market research and compile findings into a report.',
        dueDate: new Date('2024-12-25'),
        employeeName: 'Alice Brown',
        priority: 'Medium',
        taskStatus: 'Completed'
      },
      {
        title: 'Review Financial Statements',
        description: 'Review and analyze financial statements for the last quarter.',
        dueDate: new Date('2024-12-28'),
        employeeName: 'Bob Green',
        priority: 'High',
        taskStatus: 'Pending'
      },
      {
        title: 'Annual Report Writing',
        description: 'Write and submit the company’s annual report to the board.',
        dueDate: new Date('2024-12-30'),
        employeeName: 'Jane Smith',
        priority: 'Low',
        taskStatus: 'In Progress'
      },
      {
        title: 'Launch New Marketing Campaign',
        description: 'Coordinate and oversee the launch of the new marketing campaign.',
        dueDate: new Date('2025-01-10'),
        employeeName: 'Bob Green',
        priority: 'High',
        taskStatus: 'Pending'
      }
    ];
   
    this.applyFilters();
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
    const searchTerm = this.searchQuery.toLowerCase();

    this.filteredTasks = this.listOfTasks.filter((task: any) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm) || task.employeeName.toLowerCase().includes(searchTerm);
      const matchesStatus = this.selectedStatus ? task.taskStatus === this.selectedStatus : true;
      const matchesPriority = this.selectedPriority ? task.priority === this.selectedPriority : true;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    this.length = this.filteredTasks.length; 
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTasks = this.filteredTasks.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination(); 
  }
  

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
