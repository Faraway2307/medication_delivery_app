import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { ChangeEmailPopupComponent } from '../change-email-popup/change-email-popup.component';
import { ChangeMobilePopupComponent } from '../change-mobile-popup/change-mobile-popup.component';
import { ChangeAddressPopupComponent } from '../change-address-popup/change-address-popup.component';
import { SuccessPwdChangePopupComponent } from '../success-pwd-change-popup/success-pwd-change-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  panelOpenState = false;
  form1: FormGroup;

  private token: any;
  public userid: any;
  public userprofile: any;
  public role: any;
  public userlength: any;

  public expectedOldPassword: string = ''; // Set the expected old password here

  public oldpwd: any;
  public correctmatch: any;

  // Add a new property to store the validity of the old password
  public isOldPwdValid = true;
  public oldpwdmatch = false;

  constructor(fb: FormBuilder, public dialog: MatDialog, private httpClient: HttpClient) {
    // Custom validator function for password format
    const passwordValidator = (control: FormControl) => {
      const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;

      if (!passwordRegex.test(control.value)) {
        return { invalidPassword: true };
      }

      return null;
    };
    
    this.token = sessionStorage.getItem('token');
    const userinfo = new JwtHelperService().decodeToken(this.token);
    this.userlength = Object.keys(userinfo.fn.user).length;
    this.userid = userinfo.fn.user.user_id;
    this.form1 = fb.group({
      'oldPwd': ['', [Validators.required]],
      'newPwd': ['', [Validators.required, passwordValidator]],
      'confirmPwd': ['', [Validators.required, passwordValidator]]
    }, {
      validator: this.matchPwds.bind(this)
    });
  }

  ngOnInit(): void {
    console.log(this.userlength);
    this.fetchUserInfo();
  }

  // Function to fetch the password data from the backend
  fetchUserInfo() {
    if (this.userlength < 7) {
      this.role = 'Admin';
    } else {
      this.role = 'User';
    }
    this.httpClient.put<any>('http://localhost:3300/getUserInfo', { userid: this.userid, role: this.role }).subscribe(response => {
      this.userprofile = response;
    }, error => {
      console.error('Error occurred while updating data:', error);
      // Handle error scenario
    });
  }

  get oldPwd() {
    return this.form1.get('oldPwd');
  }

  get newPwd() {
    return this.form1.get('newPwd');
  }

  get confirmPwd() {
    return this.form1.get('confirmPwd');
  }

  openChangeMobilePopup(): void {
    const dialogRef = this.dialog.open(ChangeMobilePopupComponent, {
      data: {
        Token: this.token,
        role: this.role,
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
      this.fetchUserInfo();
    });
  }

  openChangeAddressPopup(): void {
    const dialogRef = this.dialog.open(ChangeAddressPopupComponent, {
      data: {
        Token: this.token,
        role: this.role,
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
      this.fetchUserInfo();
    });
  }

  // // Dynamic validator function for checking if oldPwd matches the expectedOldPassword
  // shouldBeExpectedOldPwd(control: AbstractControl): ValidationErrors | null {
  //   // Fetch the password data from the backend
  //   // console.log('Input Old Password:', control.value);
  //   // console.log('Expected Old Password:', this.expectedOldPassword);
  //   return control.value !== this.expectedOldPassword ? { shouldBeExpectedOldPwd: true } : null;
  // }

  openSuccessPwdChangePopup(): void {
    // Make the HTTP request to validate the old password
    this.httpClient.put<any>('http://localhost:3300/account/checkpw', { userid: this.userid, password: this.oldPwd?.value }).subscribe(
      response => {
        // Check if passwords match
        if (response.isMatch) {
          // The old password is valid, continue with password change
          this.isOldPwdValid = true;
          this.expectedOldPassword = response.pwd; // Set the expected old password here
  
          // Call the function that requires the passwords to match
          this.updatePassword();
  
          // Open the success password change popup
          const dialogRef = this.dialog.open(SuccessPwdChangePopupComponent);
          dialogRef.afterClosed().subscribe(() => {
            // Handle any actions after the dialog is closed
          });
        } else {
          // The old password is invalid
          this.isOldPwdValid = false;
          this.oldpwdmatch = true;
        }
      },
      error => {
        // Handle the HTTP request error (optional)
        console.error('Error occurred while updating password:', error);
        // Handle error scenario (e.g., show an error message)
      }
    );
  }

  // Custom validator function for matching newPwd and confirmPwd
  matchPwds(group: FormGroup): ValidationErrors | null {
    const newPwd = group.get('newPwd')?.value;
    const confirmPwd = group.get('confirmPwd')?.value;

    if (newPwd !== confirmPwd) {
      group.get('confirmPwd')?.setErrors({ pwdsDontMatch: true });
      return { pwdsDontMatch: true };
    } else {
      group.get('confirmPwd')?.setErrors(null);
      return null;
    }
  }

  updatePassword() {
    // Construct the SQL update query
    const updateQuery = `UPDATE users SET password = $1 WHERE userid = $2`;
    // Send the update query to your backend server
    this.httpClient.put<any>('http://localhost:3300/updatepw', { query: updateQuery, password: this.confirmPwd?.value, userid: this.userid }).subscribe(response => {
      // console.log('Data updated successfully:', response);
      // Perform any additional actions after successful update
    }, error => {
      console.error('Error occurred while updating data:', error);
      // Handle error scenario
    });
  }
}
