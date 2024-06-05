import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router'; // Import the Router module

@Component({
  selector: 'app-user-login-popup',
  templateUrl: './user-login-popup.component.html',
  styleUrls: ['./user-login-popup.component.css']
})
export class UserLoginPopupComponent {
  nric: string = '';
  password: string = '';
  user: any;

  constructor(public dialogRef: MatDialogRef<UserLoginPopupComponent>, private httpClient : HttpClient , private router: Router ) {}

  close(): void {
    this.dialogRef.close();
  }

  submitForm(form: NgForm): void {
    if (form.valid) {
      this.httpClient.post('http://localhost:3300/account/login', {
        nric: this.nric,
        password: this.password
      }).subscribe((response: any) => {
        const token = response.token;
        const role = response.role;
        // Save the token in local storage or session storage
        sessionStorage.setItem('token', token);
        const userinfo = new JwtHelperService().decodeToken(token);
        // sessionStorage.setItem('user',JSON.stringify(userinfo.fn.user));
        sessionStorage.setItem('role', role);

        // Perform further actions, such as redirecting to a protected route
        this.dialogRef.close();

        if (role === 'Patient') {
          // this.router.navigate(['/user-home']);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/user-home']); // Replace 'your-component' with the desired component path
          });
        } else if (role === 'Admin') {
          this.router.navigate(['/admin-home']);
        }
      }, (error: any) => {
        console.error('Error logging in:', error);
        // Handle login error, such as displaying an error message for invalid password
        if (error.status === 401) {
          form.controls['password'].setErrors({ 'invalidPassword': true });
        }
      });
    }
  }
}
