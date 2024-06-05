import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-create-patient-medicine-popup',
  templateUrl: './create-patient-medicine-popup.component.html',
  styleUrls: ['./create-patient-medicine-popup.component.css']
})
export class CreatePatientMedicinePopupComponent {
  searchQuery: string = '';
  searchResults: any[] = []; // Replace 'any' with appropriate interface for the search results
  public inventory: any;
  public id: any;
  public dates: Date = new Date(); 
  public searchTerm: string = '';
  public tableData :any[] = [];
  public filteredData: any[] = [];
  public searchKeyword: string = '';


  constructor(public dialogRef: MatDialogRef<CreatePatientMedicinePopupComponent>, private httpClient: HttpClient, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data.param;
  }


  ngOnInit(): void{
    this.getInventory();
  }

  close(): void {
    this.dialogRef.close();
  }

  public applyFilter(): any {
    if (this.searchKeyword === '') {
      this.filteredData = [];
      return;
    }
  
    this.filteredData = this.tableData.filter(data => {
      const medName = data.medname?.toLowerCase() || '';
      const searchKeyword = this.searchKeyword.toLowerCase();

      return medName.includes(searchKeyword)
    });
  }

/*
  searchMedicine(): void {
    // Perform search logic here based on searchQuery
    // Update the searchResults array with the matching results
    // Example:
    this.searchResults = []; // Clear previous results
    if (this.searchQuery.trim() !== '') {
      // Perform your search logic and update the searchResults array with the matching results
      // For demonstration purposes, let's assume we found two results

      this.searchResults.push(
          this.filteredData[0]
        );
    }
  }
*/

  getInventory(){
    this.httpClient.get<any>('http://localhost:3300/inventory').subscribe(
      response =>{
        console.log(response.displaymed)
        this.tableData = response.displaymed
      }
    )
  }

  addMedicine(): void {
    // Perform logic to add the selected medicine
    // Construct the SQL update query
    for (let i = 0; i < this.filteredData.length; i++) {
      const updateQuery = `INSERT INTO medicationorder (pid,startDate,encounterID,medcode,medDesc,doctorID) VALUES('${this.id}','2023-05-11','e63a3fa9-9e21-4d20-8c1f-f79403672016',
      '${this.filteredData[i].medcode}','${this.filteredData[i].meddesc.replace(/'/g, "''")}',NULL)`;
      // Send the update query to your backend server
      this.httpClient.post<any>('http://localhost:3300/create', { query: updateQuery }).subscribe(response => {
        console.log('Data updated successfully:', response);
        // Perform any additional actions after successful update
      }, error => {
        console.error('Error occurred while adding medication:', error);
        // Handle error scenario
      });
      this.dialogRef.close();

    }
  }
}
