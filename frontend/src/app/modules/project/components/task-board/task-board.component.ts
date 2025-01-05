import { Component, Input } from '@angular/core';
import { ITask, TaskPriority, TaskStatus } from '../../../../models/itask';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss'
})
export class TaskBoardComponent {
  @Input() tasks: ITask[] = [];

  taskColumns = [
    { title: 'To-Do', status: TaskStatus.todo },
    { title: 'In-Progress', status: TaskStatus.inProgress },
    { title: 'Done', status: TaskStatus.done }
  ];

  priorityColors = {
    [TaskPriority.low]: '#4caf50',
    [TaskPriority.medium]: '#ff9800',
    [TaskPriority.high]: '#f44336',
  };

  onTaskClick(task: ITask) {
    console.log('Task clicked:', task);
    // Add navigation or interaction logic here
  }

  onTaskKeyDown(event: KeyboardEvent, task: ITask) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onTaskClick(task);
    }
  }

  getTaskPriorityColor(task: ITask) {
    return this.priorityColors[task.priority];
  }

  isValidPriority(priority: any): priority is keyof typeof this.priorityColors {
    return ['low', 'medium', 'high'].includes(priority);
  }

}
