import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-patient-order-status-popup',
  templateUrl: './view-patient-order-status-popup.component.html',
  styleUrls: ['./view-patient-order-status-popup.component.css']
})
export class ViewPatientOrderStatusPopupComponent {

  public orderid:any;
  public price:any;
  public medname:any;
  public medcode:any;
  paymentHandler: any = null;

  constructor(public dialogRef: MatDialogRef<ViewPatientOrderStatusPopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, private httpClient: HttpClient) {
    this.orderid = data.orderid;
    this.price = data.price;
    this.medname = data.medname;
    this.medcode = data.medcode;
    console.log(this.medcode)
  }

  ngOnInit() {
    //this.invokeStripe();
  }

  close(): void {
    this.dialogRef.close();
    this.router.navigate(['/view-patient-order-status']);

  }
  
  // update the stock amount
  updateData() {
      // Construct the SQL update query
      const updateQuery = `UPDATE medication SET stock = (SELECT stock FROM medication WHERE medcode = '${this.medcode}' )-1 WHERE medcode = '${this.medcode}'`;
      // Send the update query to your backend server
      this.httpClient.put<any>('http://localhost:3300/update', { query: updateQuery }).subscribe(response => {
        // console.log('Data updated successfully:', response);
        // Perform any additional actions after successful update

      }, error => {
        console.error('Error occurred while updating medication stocks:', error);
        // Handle error scenario
      });
  
  }

    // update the status
    updateStatus() {
      // Construct the SQL update query
      const updateQuery = `UPDATE medicationorder SET status = 'Completed' WHERE orderid = '${this.orderid}'`;
      // Send the update query to your backend server
      this.httpClient.put<any>('http://localhost:3300/update', { query: updateQuery }).subscribe(response => {
        console.log('Data updated successfully:', response);
        // Perform any additional actions after successful update

      }, error => {
        console.error('Error occurred while updating medicationStatus:', error);
        // Handle error scenario
      });
  
  }

  makePayment(amount:any){
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51NQpCmIF9QI0SVA1aB3QuDNMTZInm0dPYCt6Iw115J1H38KfOPTkk1xlea3QItyXEwlftHdhp2xuO2ExWqRYn2Mt00pZ5XagIg',
      locale: 'auto',
      token: (stripeToken: any) => {
        console.log(stripeToken);
        this.updateData();
        this.updateStatus();
        alert('Payment succeeded!');
        this.router.navigate(['/user-home']);

       },
     });
    }

  //   paymentHandler.open({
  //     name: 'Medicine Payment',
  //     description: '',
  //     amount: amount * 100,
  //   });
  //   this.dialogRef.close();
  // }
  // invokeStripe() {
  //   if (!window.document.getElementById('stripe-script')) {
  //     const script = window.document.createElement('script');
  //     script.id = 'stripe-script';
  //     script.type = 'text/javascript';
  //     script.src = 'https://checkout.stripe.com/checkout.js';
  //     script.onload = () => {
  //       this.paymentHandler = (<any>window).StripeCheckout.configure({
  //         key: 'pk_test_51NQpCmIF9QI0SVA1aB3QuDNMTZInm0dPYCt6Iw115J1H38KfOPTkk1xlea3QItyXEwlftHdhp2xuO2ExWqRYn2Mt00pZ5XagIg',
  //         locale: 'auto',
  //         token: (stripeToken: any) => {
  //           console.log(stripeToken);
  //           alert('Payment has been successful!');
  //         },
  //       });
  //     };
  //     window.document.body.appendChild(script);
  //   }
  // }
   
}
