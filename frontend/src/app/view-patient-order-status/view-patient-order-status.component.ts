import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewPatientOrderStatusPopupComponent } from '../view-patient-order-status-popup/view-patient-order-status-popup.component';
import { HttpClient } from '@angular/common/http';
import { MakePaymentPopupComponent } from '../make-payment-popup/make-payment-popup.component';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-view-patient-order-status',
  templateUrl: './view-patient-order-status.component.html',
  styleUrls: ['./view-patient-order-status.component.css']
})
export class ViewPatientOrderStatusComponent {
  public searchKeyword: string = '';
  public filteredData: any[] = [];
  public request: any[] = [];
  public user: any;
  public selectedStatus: string = 'all';
  private token: any;
  public orderid:any;
  public price:any;
  constructor(public dialog: MatDialog, private httpClient: HttpClient) {}
  public x:any;

  ngOnInit(): void {
    this.getPatientOrder();
  }

  getPatientOrder(): void {
    this.token = sessionStorage.getItem('token');
    const userinfo = new JwtHelperService().decodeToken(this.token);
    this.user = userinfo.fn.user;

    console.log(this.user.pid);
    this.httpClient.put<any>('http://localhost:3300/requestpatientorder', { pid: this.user.pid }).subscribe(
      (response) => {
        this.request = response.rows;
        this.filteredData = this.request;
      }
    );
  }

  filterByStatus(): void {
    if (this.selectedStatus === 'all') {
      this.filteredData = this.request;
    } else {
      this.filteredData = this.request.filter((order) => order.status.toLowerCase() === this.selectedStatus);
    }
  }

  filterBySearchKeyword(): void {
    const keyword = this.searchKeyword.toLowerCase();
    this.filteredData = this.request.filter((order) => {
      return (
        order.orderid.toString().includes(keyword) ||
        order.medname.toLowerCase().includes(keyword) ||
        order.startdate.toLowerCase().includes(keyword)
      );
    });
  }

  onSearchChange(searchValue: string): void {
    if (searchValue.trim() === '') {
      this.filterByStatus();
    } else {
      this.filterBySearchKeyword();
    }
  }

  makePayment(): void {
    const dialogRef = this.dialog.open(MakePaymentPopupComponent);

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    
    });
  }

  openDialog(viewAllBtn: HTMLAnchorElement): void {

    const buttonId = viewAllBtn.id;
    console.log('Button Id:', buttonId);

    for (let i = 0; i < this.request.length; i++) {
      if(this.request[i].orderid == buttonId){
        this.x=i
      }
    }
    const dialogRef = this.dialog.open(ViewPatientOrderStatusPopupComponent,{
      width:'700px',
      data:{
        orderid : this.request[this.x].orderid,
        price : this.request[this.x].price,
        medname: this.request[this.x].medname,
        medcode: this.request[this.x].medcode
      }
    })
    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    });
  }
}
