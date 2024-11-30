import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProject, ProjectStatus } from '../../../../models/iproject';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent {
  projectForm: FormGroup;
  projectStatus = Object.values(ProjectStatus);
  projectId: string = ''; // To hold the project ID

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private readonly projectService: ProjectService
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: [ProjectStatus.Active, Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    }, { validators: [this.validateDates] });
  }

  ngOnInit(): void {
    // Fetch project ID from the route
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    if (this.projectId) {
      this.loadProjectData();
    }
  }

  // Custom validator to ensure the end date is after the start date
  validateDates(group: FormGroup): { [key: string]: boolean } | null {
    const endDateField = group.get('endDate');
    const startDate = new Date(group.get('startDate')?.value);
    const endDate = new Date(group.get('endDate')?.value);
    if (endDateField && endDate < startDate) {
      endDateField.setErrors({ endDateBeforeStartDate: true });
      return { endDateBeforeStartDate: true };
    } else {
      if (endDateField?.hasError('endDateBeforeStartDate')) {
        endDateField.setErrors(null);
      }
      return null;
    }
  }

  loadProjectData(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (project: IProject) => {
        this.projectForm.patchValue({
          name: project.name,
          description: project.description,
          status: project.status,
          budget: project.budget,
          startDate: project.startDate,
          endDate: project.endDate,
        });
      },
      error: (err) => {
        console.error('Failed to load project:', err);
        alert('Error loading project data.');
        this.router.navigate(['/project']);
      }
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const updatedProject: IProject = {
        ...this.projectForm.value,
        id: this.projectId // Ensure the ID is included for the update
      };

      this.projectService.updateProject(updatedProject).subscribe({
        next: (response) => {
          console.log('Project updated:', response);
          this.router.navigate(['/project']);
        },
        error: (err) => {
          console.error('Failed to update project:', err);
          alert('Error updating project.');
        }
      });
    } else {
      alert('Please correct the errors in the form.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/project']); // Navigate back to the project list
  }
}
