import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute} from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-create-encounter-popup',
  templateUrl: './create-encounter-popup.component.html',
  styleUrls: ['./create-encounter-popup.component.css']
})
export class CreateEncounterPopupComponent {
  encounterDate!: string; // Marked as definitely assigned

  visitReason: string = '';
  public medications: any[] = [];
  selectedMedicine: any;
  public medicines: any;

  public user:any;

  public getpid:any;
  public id: any;
  private token: any;
  constructor(
    public dialogRef: MatDialogRef<CreateEncounterPopupComponent>,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getpid = data.param;

    this.token = sessionStorage.getItem('token');
    const userinfo = new JwtHelperService().decodeToken(this.token);
    this.user = userinfo.fn.user;
  }

  ngOnInit(): void {
    // Get the current date and time and set it to the encounterDate field
    const currentDate = new Date();
    this.encounterDate = currentDate.toISOString(); // Convert to ISO format (e.g., "2023-07-05T12:34:56.789Z")
    this.getInventory()
  }

  close(): void {
    this.dialogRef.close();
  }

  // generate encounterid
  generateUUID(): string {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  
    return uuid;
  }

  // get medicines
  getInventory(): void {
    this.httpClient.get<any>('http://localhost:3300/inventory').subscribe(
      response => {
        this.medications = response.displaymed;
      }
    );
  }

  // To create encounters
  async createEncounter(encounterid: string){
    // Construct the SQL update query
    const updateQuery = `INSERT INTO encounter(encounterid, encounterdate, pid, encounterdesc, doctorid) VALUES('${encounterid}','${this.encounterDate}', '${this.getpid}','${this.visitReason}','${this.user.did}')`;
    return new Promise<void>((resolve, reject) => {
    // Assuming the HTTP request in createEncounter returns a response
    this.httpClient.post<any>('http://localhost:3300/create', { query: updateQuery })
      .subscribe(
        response => {
          // console.log('Encounter created successfully:', response);
          resolve(); // Resolve the promise when the HTTP request is successful
        },
        error => {
          console.error('Error occurred while creating encounter:', error);
          reject(error); // Reject the promise if there's an error
        }
      );
  });
}

  // To create medicationorder 
  createMedicationOrder(encounterid: string, selectedMedicine: any){
      // Construct the SQL update query
      const updateQuery = `INSERT INTO medicationorder(pid, startdate, encounterid, medcode, meddesc, status, reason, doctorid) VALUES('${this.getpid}','${this.encounterDate}', '${encounterid}','${selectedMedicine[0]}',
      '${selectedMedicine[1]}','Completed','Doctor Consultation','${this.user.did}')`;
      // Send the update query to your backend server
      this.httpClient.post<any>('http://localhost:3300/create', { query: updateQuery }).subscribe(response => {
        // console.log('Data updated successfully:', response);
      }, error => {
        console.error('Error occurred while updating medicationOrder:', error);
  
      });
  }

  // To create medicationorder 
  stockUpdate(selectedMedicine: any){
    const updatequery = `UPDATE medication SET stock = (SELECT stock FROM medication WHERE medcode = '${selectedMedicine}')-1 WHERE medcode = '${selectedMedicine}'`;
    this.httpClient.put('http://localhost:3300/update', {query:updatequery}).subscribe(
      (response) => {
        // console.log('Data updated successfully:', response);
      },
      (error) => {
        console.error('Error occurred while updating stocks:', error);
      }
    );
    
}

 async submitForm() {
    // Perform form validation and further processing
    if (!this.encounterDate || !this.visitReason) {
      // Display error message or handle validation accordingly
      console.log('Please fill in all the fields.');
      return;
    }
    // Form is valid, perform further processing
    this.selectedMedicine = this.selectedMedicine.split(',');
    const encounterid = this.generateUUID();
    await this.createEncounter(encounterid);
    this.createMedicationOrder(encounterid, this.selectedMedicine);
    this.stockUpdate(this.selectedMedicine[0]);
    // Show toaster message
    this.snackBar.open('Encounter created successfully', 'Close', {
      duration: 3000,
      horizontalPosition: 'end', // Set the horizontal position to 'end' (right)
      verticalPosition: 'top', // Set the vertical position to 'top'
      panelClass: 'toast-message', // Add a CSS class for custom styling
    });
    // Refresh purpose
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/inventory']);
    });
    // console.log('Form submitted successfully!');
    this.dialogRef.close();
  }
}
