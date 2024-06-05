import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StockRequestDialogComponent } from '../stock-request-dialog/stock-request-dialog.component';


@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.css']
})
export class MedicineComponent {


  // Temp hardcode first
  // TODO :  backend logic
  public inventory: any
  public id: any
  public index: any;
  public quantity: any;
  isEditMode = false;

  constructor(private httpClient: HttpClient, private route: ActivatedRoute,private snackBar: MatSnackBar, private router: Router,private dialog: MatDialog) {}

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  ngOnInit(): void{
    // get ID from URL
    this.id = this.route.snapshot.paramMap.get('id');
    this.getInventory()
  }

  getInventory(){
    this.httpClient.get<any>('http://localhost:3300/inventory').subscribe(
      response =>{
        for (let i = 0; i < response.displaymed.length; i++) {
          if (response.displaymed[i]['medcode'] == this.id) {
            this.index = i;
            this.inventory = response.displaymed[i]
            break;
          }
        }
      }
    )
  }

  updateData() {
    if (this.isEditMode) {
      // Construct the SQL update query
      const updateQuery = `UPDATE medication SET meddesc = '${this.inventory.meddesc.replace(/'/g, "''")}', stock = '${this.inventory.stock}' WHERE medcode = '${this.inventory.medcode}'`;
  
      // Send the update query to your backend server
      this.httpClient.put<any>('http://localhost:3300/update', { query: updateQuery }).subscribe(response => {
        // console.log('Data updated successfully:', response);
        // Perform any additional actions after successful update
  
        // Display toaster message
        this.snackBar.open('Medicine updated successfully', 'Close', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });

        // Refresh the page
      this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
        this.router.navigate(['/inventory']);
      })


      }, error => {
        console.error('Error occurred while updating data:', error);
        // Handle error scenario
      });
    }
  }
  



  deleteData() {

    const url = `http://localhost:3300/delete/${this.id}`;
    this.httpClient.delete<any>(url).subscribe(response => {
      console.log('Data deleted successfully:', response);
      // Perform any additional actions after successful update

      // Display toaster message
    this.snackBar.open('Medicine deleted successfully', 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
    // Refresh the page
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate(['/inventory']);
    })

    }, error => {
      console.error('Error occurred while updating data:', error);
      // Handle error scenario
    });
  }

  openStockRequestDialog(): void {
    const dialogRef = this.dialog.open(StockRequestDialogComponent, {
      width: '700px',
      // this need to pass data over 
      data: { medID: this.id,
        quantity:this.inventory.stock,
        medName: this.inventory.medname 
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed
      if (result) {
        // Stock request submitted
      }
    });
  }
}
