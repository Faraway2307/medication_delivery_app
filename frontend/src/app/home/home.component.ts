import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserLoginPopupComponent } from '../user-login-popup/user-login-popup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'bootstrap-popup';
  loginForm!: FormGroup;
  constructor(public dialog: MatDialog) {}
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      nric: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }
  get nricField(): any {
    return this.loginForm.get('nric');
  }
  get passwordField(): any {
    return this.loginForm.get('password');
  }
  loginFormSubmit(): void {
    console.log(this.loginForm.value);
    // Call Api
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(UserLoginPopupComponent);

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    });
  }
}
