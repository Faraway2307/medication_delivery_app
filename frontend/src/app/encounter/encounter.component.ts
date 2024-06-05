import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CreateEncounterPopupComponent } from '../create-encounter-popup/create-encounter-popup.component';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit {
  public id: any;
  public inventory: any[] = [];
  public searchKeyword: string = '';
  public filteredData: any[] = [];
  public editedOrder: any;

  public formattedData: any[] = [];

  public medications: any[] = []

  public user: any;
  private token:any;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {
      this.token = sessionStorage.getItem('token');
      const userinfo = new JwtHelperService().decodeToken(this.token);
      this.user = userinfo.fn.user
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getEncounter();
    this.getInventory();
  }

  isEditMode(order: any) {
    return this.editedOrder === order;
  }
  
  toggleEditMode(order: any) {
    if (this.isEditMode(order)) {
      this.editedOrder = null; // Disable editing
    } else {
      this.editedOrder = order; // Enable editing for the clicked order
    }
  }

  // edited to filter according to patient id and meddesc
  applyFilter(): void {
    if (this.searchKeyword === '') {
      this.filteredData = [];
      return;
    }

    this.filteredData = this.inventory.filter((data) => {
      const searchKeyword = this.searchKeyword.toLowerCase();

      const hasPatientName = data.PATIENT.toString().toLowerCase().includes(searchKeyword);
      const hasMedDesc = data.medicationOrders.some((order: any) =>
        order.meddesc.toLowerCase().includes(searchKeyword)
      );

      return hasPatientName || hasMedDesc;
    });
  }
  
  isEmpty(): boolean {
    let myInput = (document.getElementById('check') as HTMLInputElement).value;
    return myInput === '';
  }

  check(): void {
    alert('Test');
  }

  /*
  openDialog(): void {
    const dialogRef = this.dialog.open(CreatePatientMedicinePopupComponent, {
      data: { param: this.id } // Pass your parameter here
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    });
  }
  */

  openEncounterDialog(): void {
    const dialogRef = this.dialog.open(CreateEncounterPopupComponent, {
      data: { param: this.id }
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle any actions after the dialog is closed
    });
  }


  getEncounter(): void {
    this.httpClient.put<any>('http://localhost:3300/viewencounter', {did: this.user.did, pid: this.id }).subscribe(
      response => {
        const formattedData = {};
  
        response.forEach((row:any) => {
          const medicationOrder = {
            orderID: row.orderid,
            pid: row.pid,
            startDate: row.startdate,
            encounterID: row.encounterid,
            medcode: row.medcode,
            meddesc: row.meddesc,
            status: row.status,
            reason: row.reason,
            doctorID: row.doctorid
          };
  
          if (this.formattedData.hasOwnProperty(row.encounterid)) {
            // Add medication order to existing encounter
            this.formattedData[row.encounterid].medicationOrders.push(medicationOrder);
          } else {
            // Create new encounter object
            const encounter = {
              ID: row.encounterid,
              DATE: row.encounterdate,
              PATIENT: row.pid,
              DESCRIPTION: row.encounterdesc,
              doctorID: row.doctorid,
              medicationOrders: [medicationOrder]
            };
  
            this.formattedData[row.encounterid] = encounter;
          }
        });
        // console.log(this.formattedData)
        this.inventory = Object.values(this.formattedData);

      }
    );
  }

  deleteMedicationOrder(param1: number): void {
    console.log('Image clicked!');
    const url = `http://localhost:3300/deleterecord/${param1}`;
    this.httpClient.delete<any>(url).subscribe(
      (response) => {
        console.log('Data deleted successfully:', response);
      },
      (error) => {
        console.error('Error occurred while deleting data:', error);
      }
    );
  }
  

  onOrderChange(order: any) {
    const updatequery = `UPDATE medicationorder SET meddesc = '${order.orderdesc}', status = '${order.status}', reason = '${order.reason}' WHERE orderid = '${order.orderID}'`;
    this.httpClient.put('http://localhost:3300/update', {query:updatequery}).subscribe(
      (response) => {
        console.log('Data updated successfully:', response);
      },
      (error) => {
        console.error('Error occurred while updating medicationorder:', error);
      }
    );
  }

  getInventory(): void {
    this.httpClient.get<any>('http://localhost:3300/inventory').subscribe(
      response => {
        console.log(response);
        this.medications = response.displaymed;
        console.log(this.medications)
      }
    );
  }

  /*
  getInventory(): void {
    const url = `http://localhost:3300/patient/${this.id}`;
    this.httpClient.get<any[]>(url).subscribe(
      (response) => {
        console.log(response);
       this.inventory = response;
      },
      (error) => {
        console.error('Error occurred while fetching data:', error);
      }
    );
  }

  updateData(desc: string, id: number): void {
    const updateQuery = `UPDATE medicationorder SET meddesc = '${desc.replace(/'/g, "''")}' WHERE orderid = '${id}'`;

    this.httpClient.put<any>('http://localhost:3300/update', { query: updateQuery }).subscribe(
      (response) => {
        console.log('Data updated successfully:', response);
        console.log(desc, id);
      },
      (error) => {
        console.error('Error occurred while updating data:', error);
      }
    );
  }
  */
}
