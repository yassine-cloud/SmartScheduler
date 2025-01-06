import { Component, Input } from '@angular/core';
import { ITask, TaskPriority, TaskStatus } from '../../../../models/itask';
import { EditTaskDialogComponent } from '../../../task/components/edit-task-dialog/edit-task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActiveProjectService } from '../../services/active-project.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss'
})
export class TaskBoardComponent {
  @Input() tasks: ITask[] = [];

  constructor(
    private readonly dialog: MatDialog, 
    private readonly ActiveProjectService: ActiveProjectService,
  ) {}

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

  sortTasksByPriority(tasks: ITask[]) {
    return tasks.sort((a, b) => {
      if (a.priority === b.priority) {
        return 0;
      }
      return a.priority === TaskPriority.high ? -1 : 1;
    });
  }

  onTaskClick(task: ITask) {
    console.log('Task clicked:', task);
    const dialog = this.dialog.open(EditTaskDialogComponent, {
      width: '800px',
      data: {
        task: task,
        project: this.ActiveProjectService.activeProject(),
        availableTasks: this.ActiveProjectService.tasks(),
        dependentTasks: this.ActiveProjectService.tasks().filter((t) => (task.dependentTasksId ?? []).includes(t.id!)),
        availableResources: this.ActiveProjectService.resources(),
        selectedResources: this.ActiveProjectService.resources().filter((r) => (task.resourcesId ?? []).includes(r.id!)),
        availableUsers: this.ActiveProjectService.members(),
      },
    });
    dialog.afterClosed().subscribe((rtask : ITask | string ) => {
      if (typeof rtask === 'string' && rtask === 'delete') {
        this.ActiveProjectService.deleteTask(task.id!);
      } else if (typeof rtask === 'object' && rtask !== null) {
        this.ActiveProjectService.updateTask(rtask);
      }
    });
  }

  onDeleteTask(task: ITask) {
    if (confirm('Are you sure you want to delete this task? ' + task.name)) {
      this.ActiveProjectService.deleteTask(task.id!);
    }
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

  tasksByStatus(status: TaskStatus) {
    return this.tasks.filter((task) => task.status === status);
  }

}
