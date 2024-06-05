import { Component } from '@angular/core';
import { ViewOrderRequestPopupComponent } from '../view-order-request-popup/view-order-request-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-view-order-request',
  templateUrl: './view-order-request.component.html',
  styleUrls: ['./view-order-request.component.css']
})
export class ViewOrderRequestComponent {

  public showNo: number = 10;
  public searchKeyword: string = '';

  public currentPage: number = 1;
  public totalPages: number = 6;

  public hasSearchResults: boolean = true;

  public request: any;
  public count: any;
  public pendingOrders: any;

  // Add temp data here to be removed once connect to backend

  public filteredData: any;
  
  public user: any;
  private token: any;

  constructor( public dialog: MatDialog, private httpClient: HttpClient) {
    this.token = sessionStorage.getItem('token');
    const userinfo = new JwtHelperService().decodeToken(this.token);
    this.user = userinfo.fn.user.did;
  }

  ngOnInit(): void {
    this.getInventory();
  }

  getInventory(): void {

    this.httpClient.put<any>('http://localhost:3300/requestallorder', {did:this.user}).subscribe(
      response => {
        this.request = response.displaymed;
        this.pendingOrders = response.displaypending;
        this.filteredData = this.request.slice(0, this.showNo); 
        this.count = response.displaycomplete;
      }
    );
  }


  public applyFilter(): void {
    this.filteredData = this.request.filter((data:any) => {
      const paitientName = data.full_name?.toLowerCase() || '';
      const order = data.medname?.toLowerCase() || '';
      const orderDate = data.startdate?.toLowerCase() || '';
      const searchKeyword = this.searchKeyword.toLowerCase();
      
      return (
        paitientName.includes(searchKeyword) ||
        order.includes(searchKeyword) ||
        orderDate.includes(searchKeyword)
      );
    });
    this.totalPages = Math.ceil(this.filteredData.length / this.showNo);
    // Update the `hasSearchResults` flag
    //this.hasSearchResults = this.filteredData.length > 0;

    // Adjust current page if it exceeds the total number of pages
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  
    const startIndex = (this.currentPage - 1) * this.showNo;
    const endIndex = startIndex + this.showNo;
    this.filteredData = this.filteredData.slice(startIndex, endIndex);
  }

public onSearchChange(searchValue: string): void {
  this.hasSearchResults = this.filteredData.length > 0;
  if (searchValue.trim() === '' && !this.hasSearchResults) {
    this.filteredData = this.request.slice(0, this.showNo);
    this.hasSearchResults = this.filteredData.length > 0;
    this.totalPages = Math.ceil(this.request.length / this.showNo);
    this.currentPage = 1;
  } else {
    this.applyFilter();
  }
}
  

  public changeShowNo(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.showNo);
    this.currentPage = 1;
    this.updateCurrentPageData();
  }
  

  public updateCurrentPageData(): void {
    const startIndex = (this.currentPage - 1) * this.showNo;
    const endIndex = startIndex + this.showNo;
    this.filteredData = this.request.slice(startIndex, endIndex);
  }

  public setCurrentPage(page: number): void {
    this.currentPage = page;
    this.updateCurrentPageData();
  }

  public getPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  openDialog(orderinfo:any): void {
    const dialogRef = this.dialog.open(ViewOrderRequestPopupComponent, {
      data: { param: orderinfo }
    });
    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    });
  }

}
