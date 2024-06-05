import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-change-mobile-popup',
  templateUrl: './change-mobile-popup.component.html',
  styleUrls: ['./change-mobile-popup.component.css']
})

export class ChangeMobilePopupComponent {

  private token: any;
  public userid: any;
  public role: any;

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private httpClient: HttpClient) {
    this.token = data.Token;
    this.role = data.role;
    const userinfo = new JwtHelperService().decodeToken(this.token);
    this.userid = userinfo.fn.user.user_id;
  }

  update() {
    let table = this.role === 'Admin' ? 'admin' : 'patient';
    const updatequery = `UPDATE ${table} SET contact = ${this.mobileFormControl.value} WHERE user_id = '${this.userid}'`;

    this.httpClient.put('http://localhost:3300/update', { query: updatequery }).subscribe(
      (response) => {
        // console.log('Data updated successfully:', response);
        //toaster or something
      },
      (error) => {
        console.error('Error occurred while updating mobile:', error);
      }
    );

    this.closeDialog();
  }

  mobileFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[89]\\d{7}$') // 8 digits starting with 8 or 9
  ]);

  matcher = new MyErrorStateMatcher();

  closeDialog(): void {
    this.dialog.closeAll();
  }

}
