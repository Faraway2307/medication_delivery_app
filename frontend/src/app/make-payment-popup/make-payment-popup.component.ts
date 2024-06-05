import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

interface Order {
  orderid: number;
  medname: string;
  startdate: string;
  status: string;
  price: number;
  selected: boolean;
  medcode: number;
}

@Component({
  selector: 'app-make-payment-popup',
  templateUrl: './make-payment-popup.component.html',
  styleUrls: ['./make-payment-popup.component.css']
})
export class MakePaymentPopupComponent {
  public inventory: any;
  orders: Order[] = []
  selectAll: boolean = false;
  filteredOrders: Order[] = [];
  paymentHandler: any = null;

  totalPaymentPrice: number = 0;


  public user: any;
  private token: any;
  constructor(
    public dialogRef: MatDialogRef<MakePaymentPopupComponent>,
    private httpClient: HttpClient,
    private router: Router,
  ) {

    this.token = sessionStorage.getItem('token');
    const userinfo = new JwtHelperService().decodeToken(this.token);
    this.user = userinfo.fn.user;
  }

  ngOnInit(): void {
    this.getInventory();
    // this.filterOrdersByStatus('Approved');
    this.invokeStripe();
  }

  close(): void {
    this.dialogRef.close();
  }

  toggleSelectAll(): void {
    this.filteredOrders.forEach((order) => {
      order.selected = this.selectAll;
    });
  }

  updateSelectAllState(): void {
    this.selectAll = this.filteredOrders.every((order) => order.selected);
  }

  filterOrdersByStatus(status: string): void {
    this.filteredOrders = this.orders.filter((order) => order.status === status);
    this.updateSelectAllState();
  }

  calculateSubtotal(order: Order): number {
    // Calculate the subtotal based on the order
    // Example: return order.quantity * order.price;
    return Number(order.price);
  }

  // collate total price to be paid
  calculateTotalPrice(): number {
    let totalPrice: number = 0;
    this.filteredOrders.forEach((order) => {
      if (order.selected) {
        totalPrice += this.calculateSubtotal(order);
      }
    });
    this.totalPaymentPrice = totalPrice;
    return totalPrice;
  }

  calculateStock(order: Order): number {
    return Number(order.medcode);
  }

  // collate all stock be reduced
  calculateTotalStock(): number[] {
    let totalStock: number[] = [];
    this.filteredOrders.forEach((order) => {
      if (order.selected) {
        totalStock.push(this.calculateStock(order));
      }
    });
    return totalStock;
  }

  calculateorderid(order: Order): number {
    return Number(order.orderid);
  }

  // collate all orderid to be paid
  calculatetotalOrderid(): number[] {
    let totalorderid: number[] = [];
    this.filteredOrders.forEach((order) => {
      if (order.selected) {
        totalorderid.push(this.calculateorderid(order));
      }
    });
    return totalorderid;
  }

  // update the stock amount
  updateStock() {
    for (let i = 0; i < this.calculatetotalOrderid().length; i++) {
      // Construct the SQL update query
      const updateQuery = `UPDATE medication SET stock = (SELECT stock FROM medication WHERE medcode = '${this.calculateTotalStock()[i]}' )-1 
      WHERE medcode = '${this.calculateTotalStock()[i]}'`;
      // Send the update query to your backend server
      this.httpClient.put<any>('http://localhost:3300/update', { query: updateQuery }).subscribe(response => {
      console.log('Data updated successfully:', response);
      // Perform any additional actions after successful update

      }, error => {
        console.error('Error occurred while updating stock:', error);
        // Handle error scenario
      });
    }

}

  // update the status of medication Order
  updateStatus() {
    for (let i = 0; i < this.calculatetotalOrderid().length; i++) {
      // Construct the SQL update query
      const updateQuery = `UPDATE medicationorder SET status = 'Completed'
      WHERE orderid = '${this.calculatetotalOrderid()[i]}'`;
      // Send the update query to your backend server
      this.httpClient.put<any>('http://localhost:3300/update', { query: updateQuery }).subscribe(response => {
      // console.log('Data updated successfully:', response);
      // Perform any additional actions after successful update

      }, error => {
        console.error('Error occurred while updating medicationorder :', error);
        // Handle error scenario
      });
    }
}

  getInventory(){
    this.httpClient.put<any>('http://localhost:3300/approvedorder', {pid:this.user.pid}).subscribe(
      response =>{
        this.inventory = response.rows;
        // console.log(this.inventory)
        this.filteredOrders = this.inventory;   
      }, error => {
      console.error('Error occurred while obtaining data:', error);
      // Handle error scenario
    });
  }


  makePayment(amount: any) {
    if (this.totalPaymentPrice === 0) {
      console.log('Total price is 0. Payment button will be disabled.');
      return; // Do not proceed if total price is 0
    }
  
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51NQpCmIF9QI0SVA1aB3QuDNMTZInm0dPYCt6Iw115J1H38KfOPTkk1xlea3QItyXEwlftHdhp2xuO2ExWqRYn2Mt00pZ5XagIg',
      locale: 'auto',
      token: (stripeToken: any) => {
        console.log(stripeToken);
        alert('Payment succeeded!');
        this.updateStatus();
        this.updateStock();
        this.router.navigate(['/user-home']);
      },
    });
  
    paymentHandler.open({
      name: 'Medicine Payment',
      description: '',
      amount: amount * 100,
    });
    this.dialogRef.close();
  }
  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51NQpCmIF9QI0SVA1aB3QuDNMTZInm0dPYCt6Iw115J1H38KfOPTkk1xlea3QItyXEwlftHdhp2xuO2ExWqRYn2Mt00pZ5XagIg',
          locale: 'auto',
          token: (stripeToken: any) => {
            console.log(stripeToken);
            alert('Payment has been successful!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }
}
