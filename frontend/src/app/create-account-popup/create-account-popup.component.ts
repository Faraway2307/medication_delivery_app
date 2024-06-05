import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account-popup',
  templateUrl: './create-account-popup.component.html',
  styleUrls: ['./create-account-popup.component.css']
})
export class CreateAccountPopupComponent {
  fullName: string = '';
  nric: string = '';
  password: string = '';
  userRole: string = '';
  birthdate: string = '';

  constructor(public dialogRef: MatDialogRef<CreateAccountPopupComponent>, private httpClient: HttpClient ,  private router: Router,private snackBar: MatSnackBar) {}

  close(): void {
    this.dialogRef.close();
  }

  submitForm(form: NgForm): void {
    if (form.valid) {
      // Password validation check
      if (!this.isPasswordValid(this.password)) {
        // Show password validation error message
        this.snackBar.open('Password must contain at least 1 special character, 1 uppercase letter, and be at least 8 characters long.', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'toast-message',
        });
        return;
      }

      const updateQuery_patient =` INSERT INTO patient(
        birthdate, nric, gender, full_name, contact, race, address, user_id)
        VALUES ('${this.birthdate}', '${this.nric}' , 'M' , '${this.fullName}', '96767777', 'Asian', 'SIT@NYP', (SELECT MAX(userid) FROM users))`;

      this.httpClient.post<any>('http://localhost:3300/account/register', { nric:this.nric, password: this.password, role:this.userRole ,query_patient: updateQuery_patient }).subscribe(response => {
        console.log('Data updated successfully:', response);

        this.snackBar.open('Account created successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: 'toast-message',
        });

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/admin-home']);
        });
      }, error => {
        console.error('Error occurred while creating account:', error);
        // Handle error scenario
      });

      this.dialogRef.close();
    }
  }

  isPasswordValid(password: string): boolean {
    // Password must contain at least 1 special character, 1 uppercase letter, and be at least 8 characters long.
    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const uppercaseRegex = /[A-Z]/;

    return password.length >= 8 && specialCharacterRegex.test(password) && uppercaseRegex.test(password);
  }
}
