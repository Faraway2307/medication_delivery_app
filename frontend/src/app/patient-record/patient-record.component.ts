import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePatientMedicinePopupComponent } from '../create-patient-medicine-popup/create-patient-medicine-popup.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styleUrls: ['./patient-record.component.css']
})
export class PatientRecordComponent {

  public id: any
  public name: any
  public inventory: any
  public searchTerm: string = '';
  public tableData :any[] = [];
  public filteredData: any[] = [];
  public searchKeyword: string = '';
  //isEditMode = false;

  public isEditMode: boolean = false;



  constructor(public dialog: MatDialog, private route: ActivatedRoute, private httpClient: HttpClient) {}

  ngOnInit(): void{
    this.id = this.route.snapshot.paramMap.get('id');

    this.getInventory();

  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }
  

  public applyFilter(): void {
    if (this.searchKeyword === '') {
      this.filteredData = [];
      return;
    }
  
    this.filteredData = this.tableData.filter(data => {
      const patientName = data.medname?.toLowerCase() || '';
      const searchKeyword = this.searchKeyword.toLowerCase();
  
      return patientName.includes(searchKeyword);
    });
  }

  imageClickHandler(event: Event, param1 : number): void {
    // Perform actions when the image is clicked
    console.log("Image clicked!");
    // Add your desired code here
    const url = `http://localhost:3300/deleterecord/${param1}`;
    this.httpClient.delete<any>(url).subscribe(response => {
      // console.log('Data deleted successfully:', response);
      // Perform any additional actions after successful update
    }, error => {
      console.error('Error occurred while deleteing data:', error);
      // Handle error scenario
    });
  }

  public isEmpty(): boolean {
    let myInput = (document.getElementById("check") as HTMLInputElement).value
    if (myInput == '') {
      return true;
  }
  return false;
  }

  public check(): void {
    alert("Test");
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreatePatientMedicinePopupComponent , {
      data: { param: this.id } // Pass your parameter here
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    });
  }
  
  getInventory(){
    const url = `http://localhost:3300/patient/${this.id}`;
    this.httpClient.put<any>(url, null).subscribe(
      response =>{
        console.log(response)
        this.inventory = response.rows
        this.tableData = response.rows.slice(1)
      }
    )
  }


  updateData( desc : string, id: number) {
    // Construct the SQL update query
    const updateQuery = `UPDATE medicationorder SET meddesc = '${desc.replace(/'/g, "''")}' WHERE orderid = '${id}'`;

    // Send the update query to your backend server
    this.httpClient.put<any>('http://localhost:3300/update', { query: updateQuery }).subscribe(response => {
      // console.log('Data updated successfully:', response);
      
      // Perform any additional actions after successful update
    }, error => {
      console.error('Error occurred while updating medication Order:', error);
      // Handle error scenario
    });
  }
}
