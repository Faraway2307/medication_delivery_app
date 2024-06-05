import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateAccountPopupComponent } from '../create-account-popup/create-account-popup.component';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {

  public patient: any
  public medicine: any
  public shortage: any


  public searchTerm: string = '';
// Temp hardcode data here to be removed ...
  public tableData :any[] = [];
  // Add more data here
  public user: any;
  public userfull_name: any;
  private token: any;
  public ordernum: any;
  
  constructor(public dialog: MatDialog, private httpClient: HttpClient) { 
    this.token = sessionStorage.getItem('token');
    const userinfo = new JwtHelperService().decodeToken(this.token);
    this.user = userinfo.fn.user;
    this.userfull_name=this.user.full_name;
  }

  public filteredData: any[] = [];
  public searchKeyword: string = '';

  public applyFilter(): void {
    if (this.searchKeyword === '') {
      this.filteredData = [];
      return;
    }
  
    this.filteredData = this.tableData.filter(data => {
      const patientName = data.full_name?.toLowerCase() || '';
      const searchKeyword = this.searchKeyword.toLowerCase();
  
      return patientName.includes(searchKeyword);
    });
  }
  

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateAccountPopupComponent);

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    });
  }

  ngOnInit(): void{
    this.getPatients()
    this.getInventory()
    this.getReqOrder()
  }

  getReqOrder(): void {
    this.httpClient.put<any>('http://localhost:3300/requestallorder', {did:this.user.did}).subscribe(
      response => {
        this.ordernum = response.displaypending;
      }
    );
  }

  getInventory(){
    this.httpClient.get<any>('http://localhost:3300/inventory').subscribe(
      response =>{
        this.medicine = response.displaycapacity
        this.shortage = response.displayshortage
      }
    )
  }

  getPatients(){
    this.httpClient.get<any>('http://localhost:3300/filterpid').subscribe(
      response =>{
        this.tableData = response.rows;
      }
    )
  }
}
