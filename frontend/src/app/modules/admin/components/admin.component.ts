import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users = [];

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe(
      (data: any) => {
        this.users = data;
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  openModifyUserDialog(user: any): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.modifyUser(result).subscribe(
          (response: any) => {
            console.log('Modify User Response:', response);
            this.loadUsers();
            this.snackBar.open('User modified successfully', '', { duration: 2000 });
          },
          (error: any) => {
            console.error('Error modifying user', error);
            this.snackBar.open('Error modifying user', '', { duration: 2000 });
          }
        );
      }
    });
  }

  toggleUserStatus(user: any): void {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    this.adminService.updateUserStatus(user.id, newStatus).subscribe(
      (response: any) => {
        console.log('Status Update Response:', response);
        this.loadUsers();
        this.snackBar.open('User status updated successfully', '', { duration: 2000 });
      },
      (error: any) => {
        console.error('Error updating status', error);
        this.snackBar.open('Error updating user status', '', { duration: 2000 });
      }
    );
  }

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'status', 'actions'];
}
