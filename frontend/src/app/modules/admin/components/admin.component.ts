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
      (data:any) => {
        this.users = data;  
      },
      (error:any) => {
        console.error('Error fetching users', error);
      }
    );
  }


  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { action: 'Add' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.addUser(result.data).subscribe(
          (response:any) => {
            console.log('Add User Response:', response);
            this.loadUsers(); 
            this.snackBar.open('User added successfully', '', { duration: 2000 });
          },
          (error:any) => {
            console.error('Error adding user', error);
            this.snackBar.open('Error adding user', '', { duration: 2000 });
          }
        );
      }
    });
  }


  openModifyUserDialog(user: any): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { action: 'Modify', user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.modifyUser(result.data).subscribe(
          (response:any) => {
            console.log('Modify User Response:', response);
            this.loadUsers();  
            this.snackBar.open('User modified successfully', '', { duration: 2000 });
          },
          (error:any) => {
            console.error('Error modifying user', error);
            this.snackBar.open('Error modifying user', '', { duration: 2000 });
          }
        );
      }
    });
  }

  openDeleteUserDialog(user: any): void {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { action: 'Delete', user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.deleteUser(user.id).subscribe(
          (response:any) => {
            console.log('Delete User Response:', response);
            this.users = this.users.filter((u:any) => u.id !== user.id);
            this.snackBar.open('User deleted successfully', '', { duration: 2000 });
          },
          (error:any) => {
            console.error('Error deleting user', error);
            this.snackBar.open('Error deleting user', '', { duration: 2000 });
          }
        );
      }
    });
  }

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'status', 'actions'];
}
