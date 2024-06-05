import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-pwd-change-popup',
  templateUrl: './success-pwd-change-popup.component.html',
  styleUrls: ['./success-pwd-change-popup.component.css']
})
export class SuccessPwdChangePopupComponent {
  constructor(public dialogRef: MatDialogRef<SuccessPwdChangePopupComponent>, private router: Router) {}

  close(): void {
    this.dialogRef.close();
  }
  
  userHome(): void {
    this.dialogRef.close();
    this.router.navigate(['/user-profile']);
  }
}
