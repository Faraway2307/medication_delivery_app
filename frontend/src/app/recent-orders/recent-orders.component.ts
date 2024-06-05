import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

interface Product {
  medcode: number;
  medname: string;
  pid: number;
  encounterid: string;
  doctorid: number;
  price: number;
  stock: number;
  meddesc: string
}

@Component({
  selector: 'app-recent-orders',
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.css']
})
export class RecentOrdersComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  user:any;
  token:any;
  did: any;
  public eid: any;
  medicationorderdate:any
  public currentDate: any;

  constructor(private httpClient:HttpClient ,private snackBar: MatSnackBar) {
    this.token = sessionStorage.getItem('token');
    const userinfo = new JwtHelperService().decodeToken(this.token);
    this.user = userinfo.fn.user;
  }

  ngOnInit() {
    // Get the current date and time and set it to the medicationorder Date field
    const currentDate = new Date();
    this.medicationorderdate = currentDate.toISOString(); // Convert to ISO format (e.g., "2023-07-05T12:34:56.789Z")
    this.getInventory();
    // this.getdid(); // function is abit wonky 
    this.search(); // Call search method to show all products initially
  }

  getInventory(): void {
    this.httpClient.put<any>('http://localhost:3300/userpage', {querytext:this.user.pid+' ORDER BY mo.startdate DESC'}).subscribe(
      response => {
          this.products = response.rows;
          this.filteredProducts = this.products; 
      }
    );
  }

  // // get doctorID 
  // getdid(){
  //   this.httpClient.put<any>('http://localhost:3300/getdid', {pid:this.user.pid}).subscribe(
  //     response => {
  //         this.did = response.rows[0].doctorid;
  //     }
  //   );
  // }

  // // get doctorID 
  // geteid(medcode: number): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.httpClient.put<any>('http://localhost:3300/geteid', { pid: this.user.pid, medcode: medcode }).subscribe(
  //       response => {
  //         const eid = response.rows[0].encounterid;
  //         resolve(eid);
  //       },
  //       error => {
  //         reject(error);
  //       }
  //     );
  //   });
  // }

  addtoCart(medcode: number, meddesc: string, encounterID: string, did: number) {

    const updateQuery_patient = ` INSERT INTO medicationorder(
          pid,startdate,encounterid,medcode,meddesc,status,reason,doctorid)
          VALUES ('${this.user.pid}','${this.medicationorderdate}','${encounterID}' , '${medcode}' , '${meddesc.replace(/'/g, "''")}', 
          'Pending','Medication Order','${did}')`;
    // Send the update query to your backend server
    this.httpClient.post<any>('http://localhost:3300/create', { query: updateQuery_patient }).subscribe(response => {
      // console.log('Data updated successfully:', response);
      // Perform any additional actions after successful update
    }, error => {
      console.error('Error occurred while adding to cart:', error);
      // Handle error scenario
    });
  
  }
  

  search() {
    // Filter the products based on the search query
    if (this.searchQuery.trim() === '') {
        // do nothing
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.medname.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
}
