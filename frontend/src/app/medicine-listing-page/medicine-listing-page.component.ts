import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';

interface Product {
  medcode: number;
  medname: string;
  meddesc: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-medicine-listing-page',
  templateUrl: './medicine-listing-page.component.html',
  styleUrls: ['./medicine-listing-page.component.css']
})
export class MedicineListingPageComponent {
  inventory: Product[] = [];
  filteredProducts: Product[] = []; // New variable to hold filtered products
  searchQuery: string = ''; // New variable to store the search query
  public user: any;
  public token:any;
  public currentDate: any;

  constructor(private httpClient: HttpClient,private snackBar: MatSnackBar,) {}

  ngOnInit() {
    this.getInventory();
    this.search(); // Call search method to show all products initially
  }

  getInventory(): void {
    this.httpClient.get<any>('http://localhost:3300/inventory').subscribe(
      response => {
        this.inventory = response.displaymed;
        this.filteredProducts = response.displaymed;
      }
    );
  }

  search() {
    // Filter the products based on the search query
  if (this.searchQuery.trim() === '') {
    this.filteredProducts = this.inventory; // Show all products
    // console.log(this.filteredProducts)
  } else {
    this.filteredProducts = this.inventory.filter(product =>
      product.medname.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}

// createMedicationOrder(medcode: number, meddesc: string): void {
//   this.token = sessionStorage.getItem('token');
//   const userinfo = new JwtHelperService().decodeToken(this.token);
//   this.user = userinfo.fn.user;

//   const today = new Date();
//   const year = today.getFullYear().toString().padStart(4, '0');
//   const month = (today.getMonth() + 1).toString().padStart(2, '0');
//   const day = today.getDate().toString().padStart(2, '0');
//   this.currentDate = `${year}-${month}-${day}`;

//   console.log(this.user['pid']);
//     const updateQuery_patient =` INSERT INTO medicationorder(
//       pid,startDate,encounterID,medCode,medDesc,status,doctorID)
//       VALUES ('${this.user.pid}','${this.currentDate}','e63a3fa9-9e21-4d20-8c1f-f79403672016' , '${medcode}' , '${meddesc.replace(/'/g, "''")}', 'Pending','1')`;
//     // Send the update query to your backend server
//     this.httpClient.post<any>('http://localhost:3300/create', { query: updateQuery_patient }).subscribe(response => {
//       console.log('Data updated successfully:', response);
//       // Show toaster message
//       this.snackBar.open('Ordered successfully', 'Close', {
//         duration: 3000,
//         horizontalPosition: 'end', // Set the horizontal position to 'end' (right)
//         verticalPosition: 'top', // Set the vertical position to 'top'
//         panelClass: 'toast-message', // Add a CSS class for custom styling
//       });
//       // Perform any additional actions after successful update
//     }, error => {
//       console.error('Error occurred while updating data:', error);
//       // Handle error scenario
//     });

// }

}
