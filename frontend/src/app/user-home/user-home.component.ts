import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

interface Product {
  medcode: number;
  medname: string;
  meddesc: string;
  encounterid: string;
  doctorid: number;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent {
  constructor(private router: Router, private httpClient:HttpClient , private snackBar: MatSnackBar) { }

  public pendingquantity: any;
  public recentorder: any;
  public user: any;
  public userfull_name: any;
  private token: any;
  public currentDate: any;

  ngOnInit(): void{
    this.getInventory();
  }

  cartItems: Product[] = [];
  products: Product[] = [];
  

  getInventory(){
    this.token = sessionStorage.getItem('token');
    const userinfo = new JwtHelperService().decodeToken(this.token);
    this.user = userinfo.fn.user;
    this.userfull_name=this.user.full_name;
    this.httpClient.put<any>('http://localhost:3300/userpage', {querytext:this.user.pid.toString()+' ORDER BY mo.startdate DESC LIMIT 5', pid:this.user.pid}).subscribe(

      response =>{
        this.pendingquantity = response.displaypendingnum
        this.recentorder = response.displayrecentorder
        this.products = this.recentorder;
      }
    )
  }

  // add to cart function
  addtoCart(medcode: number, meddesc: string, encounterID: string, did: number) {
    const cDate = new Date();
    this.currentDate = cDate.toISOString();

    const updateQuery_patient = ` INSERT INTO medicationorder(
          pid,startdate,encounterid,medcode,meddesc,status,reason,doctorid)
          VALUES ('${this.user.pid}','${this.currentDate}','${encounterID}' , '${medcode}' , '${meddesc.replace(/'/g, "''")}', 
          'Pending','Medication Order','${did}')`;
    // Send the update query to your backend server
    this.httpClient.post<any>('http://localhost:3300/create', { query: updateQuery_patient }).subscribe(response => {
      // Perform any additional actions after successful update
      // Show toaster message
        this.snackBar.open('Ordered successfully please refresh your page to see the changes', 'Close', {
        duration: 3000,
        horizontalPosition: 'end', // Set the horizontal position to 'end' (right)
        verticalPosition: 'top', // Set the vertical position to 'top'
        panelClass: 'toast-message', // Add a CSS class for custom styling
      });
    }, error => {
      console.error('Error occurred adding to cart:', error);
      // Handle error scenario
    });
  
  }
}
