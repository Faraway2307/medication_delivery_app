import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-change-address-popup',
  templateUrl: './change-address-popup.component.html',
  styleUrls: ['./change-address-popup.component.css']
})
export class ChangeAddressPopupComponent {

  private token : any;
  public userid: any;

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private httpClient: HttpClient) {
    this.token = data.Token;
    const userinfo = new JwtHelperService().decodeToken(this.token);
    this.userid = userinfo.fn.user.user_id;
  }

  update(){
    console.log(this.addressFormControl.value)
    const updatequery = `UPDATE patient SET address = '${this.addressFormControl.value}' WHERE user_id = '${this.userid}'`;
    this.httpClient.put('http://localhost:3300/update', {query:updatequery}).subscribe(
      (response) => {
        // console.log('Data updated successfully:', response);
      },
      (error) => {
        console.error('Error occurred while updating address:', error);
      }
    );
    this.closeDialog();
  }

  addressFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new MyErrorStateMatcher();

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
