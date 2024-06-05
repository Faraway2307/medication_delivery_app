import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateMedicinePopupComponent } from '../create-medicine-popup/create-medicine-popup.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  public inventory: any[] = [];
  public capacity: number = 0;
  public shortage:any;
  public searchQuery: string = '';

  constructor(public dialog: MatDialog, private httpClient: HttpClient) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateMedicinePopupComponent);

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    });
  }

  ngOnInit(): void {
    this.getInventory();
  }

  getInventory(): void {
    this.httpClient.get<any>('http://localhost:3300/inventory').subscribe(
      response => {
        // console.log(response);
        this.inventory = response.displaymed;
        this.capacity = response.displaycapacity;
        this.shortage = response.displayshortage;
      }
    );
  }

  filterInventory(): any[] {
    if (!this.searchQuery) {
      return this.inventory;
    }
    const query = this.searchQuery.toLowerCase();
    return this.inventory.filter(item =>
      item.medname.toLowerCase().includes(query)
    );
  }
}
