import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { share } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create-medicine-popup',
  templateUrl: './create-medicine-popup.component.html',
  styleUrls: ['./create-medicine-popup.component.css']
})
export class CreateMedicinePopupComponent {
  medicineName: string = '';
  quantity: number | null = null;
  howToUse: string = '';
  public inventory: any;

  constructor(public dialogRef: MatDialogRef<CreateMedicinePopupComponent>, private httpClient: HttpClient,private toastr: ToastrService,
    private router: Router,private snackBar: MatSnackBar,) {}

  close(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
    // Perform form validation and further processing
    if (!this.medicineName || !this.quantity || !this.howToUse) {
      // Display error message or handle validation accordingly
      console.log('Please fill in all the fields.');
      return;
    }
    // Form is valid, perform further processing
        // Construct the SQL update query
    const updateQuery = `INSERT INTO medication(medname, meddesc, stock) VALUES('${this.medicineName}','${this.howToUse.replace(/'/g, "''")}','${this.quantity}')`;
    // Send the update query to your backend server
    this.httpClient.post<any>('http://localhost:3300/create', { query: updateQuery }).subscribe(response => {
      console.log('Data updated successfully:', response);
      // Show toaster message
      this.snackBar.open('Medicine created successfully', 'Close', {
        duration: 3000,
        horizontalPosition: 'end', // Set the horizontal position to 'end' (right)
        verticalPosition: 'top', // Set the vertical position to 'top'
        panelClass: 'toast-message', // Add a CSS class for custom styling
      });
      // refresh purpose 
      this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
        this.router.navigate(['/inventory']);
      })
      
    }, error => {
      console.error('Error occurred while creating medication:', error);
      // Handle error scenario
    });
    console.log('Form submitted successfully!');
    this.dialogRef.close();
  }

  /*
  postData() {
    // Construct the SQL update query
    const updateQuery = `INSERT INTO medication(medname, meddesc, stock) VALUES('${this.medicineName}','${this.howToUse.replace(/'/g, "''")}','${this.quantity}')`;
    // Send the update query to your backend server
    this.httpClient.post<any>('http://localhost:3300/create', { query: updateQuery }).subscribe(response => {
      console.log('Data updated successfully:', response);
      console.log(this.medicineName);
      console.log(this.howToUse);
      // Perform any additional actions after successful update
    }, error => {
      console.error('Error occurred while updating data:', error);
      // Handle error scenario
    });
  } */

}
