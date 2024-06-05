import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-order-request-popup',
  templateUrl: './view-order-request-popup.component.html',
  styleUrls: ['./view-order-request-popup.component.css']
})
export class ViewOrderRequestPopupComponent {
  public showRejectionForm: boolean = false;
  public rejectionReason: string = '';
  public isRejectionReasonEmpty: boolean = false;

  public orderid:any;
  public medname:any;
  
  public data: any;

  constructor(public dialogRef: MatDialogRef<ViewOrderRequestPopupComponent>,private snackBar: MatSnackBar, private httpClient: HttpClient, private router: Router, @Inject(MAT_DIALOG_DATA) public info: any) {
    this.data = info.param;

    this.orderid = this.data.orderid;
    this.medname = this.data.meddesc;
  }

  complete(): void {
    // Apply Backend logic here 

    // Construct the SQL update query
    const updateQuery = `UPDATE medicationorder SET status = 'Approved' WHERE orderid='${this.data.orderid}'`;

    // Send the update query to your backend server
    this.httpClient.put<any>('http://localhost:3300/update', { query: updateQuery }).subscribe(response => {
      // console.log('Data updated successfully:', response);
      // Perform any additional actions after successful update

      // Display toaster message
      this.snackBar.open('Medicine updated successfully', 'Close', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });

      // Refresh the page
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate(['/view-order-request']);
    })


    }, error => {
      console.error('Error occurred while updating medication Order:', error);
      // Handle error scenario
    });

    // need to do notification - to notify user estimated delivery date 
    // inventory update 
    
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  confirmRejection(): void {
    if (this.rejectionReason.trim() !== '') {
    // Apply Backend logic here 

    // Construct the SQL update query
    const updateQuery = `UPDATE medicationorder SET status = 'Rejected', reason = '${this.rejectionReason}' WHERE orderid='${this.data.orderid}'`;

    // Send the update query to your backend server
    this.httpClient.put<any>('http://localhost:3300/update', { query: updateQuery }).subscribe(response => {
      // console.log('Data updated successfully:', response);
      // Perform any additional actions after successful update

      // Display toaster message
      this.snackBar.open('Medicine updated successfully', 'Close', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });

      // Refresh the page
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate(['/inventory']);
    })


    }, error => {
      console.error('Error occurred while updating data:', error);
      // Handle error scenario
    });
       // Show toaster message
       this.snackBar.open('Reject request successfully', 'Close', {
        duration: 5000,
        horizontalPosition: 'end', // Set the horizontal position to 'end' (right)
        verticalPosition: 'top', // Set the vertical position to 'top'
        panelClass: 'toast-message', // Add a CSS class for custom styling
      });
      this.dialogRef.close();
    } else {
      this.isRejectionReasonEmpty = true;
    }
  }
}
