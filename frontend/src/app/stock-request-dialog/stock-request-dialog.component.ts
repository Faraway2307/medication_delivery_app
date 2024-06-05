import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stock-request-dialog',
  templateUrl: './stock-request-dialog.component.html',
  styleUrls: ['./stock-request-dialog.component.css']
})
export class StockRequestDialogComponent {
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() dialogClosed = new EventEmitter<void>();

  public medId: any;
  public quantity: any;
  public _id: any;
  public currentID: any;
  array: any[] = [];
  public number : any;
  public medName: any;
  public currQuantity:any;

  constructor(public dialogRef: MatDialogRef<StockRequestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute,private httpClient: HttpClient) {
    this.medId = data.medID;
    this.quantity = data.quantity;
    this.medName =data.medName;
    
  }

  ngOnInit(): void {
    // get ID from URL
    this.number = this.route.snapshot.paramMap.get('id');
    console.log()
    this.getStock();
  }  

  submitForm(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.save();
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
    this.dialogClosed.emit();
  }
  save() {
    if (this.currentID == this.medId) {
      console.log(this.medId)
      this.updateQuantity();
    }
    else {
      this.register();
    }
  }
  getStock() {
    this.httpClient.get("http://localhost:8000/user/getAll")
      .subscribe((resultData: any) => {
        var tempObj = resultData.data;
        var dataArray = Object.keys(tempObj).map(function (k) { return tempObj[k] });
        const result = this.extractValue(dataArray, '_id')
        const currQuan = this.extractValue(dataArray,'quantity')
        console.log(dataArray)
        for(let i =0;i<result.length;i++){
          if(this.medId == result[i]){
            this.currentID = result[i]
            this.currQuantity = currQuan[i]
            console.log(result[i])
            console.log(this.currQuantity)
            break;
          }else{
            this.currentID = ''
          }
        }
      });
  }
  extractValue(arr: any[], prop: string | number) {

    // extract value from property
    let extractedValue = arr.map(item => item[prop]);

    return extractedValue;

  }
  setUpdate(data: any) {
    this.medId = data.medId;
    this.quantity = data.quantity;
    this.currentID = data._id;
  }
  updateQuantity() {
    let bodyData = {
      "medId": this.medId,
      "quantity": Number(this.quantity) +Number(this.currQuantity)
    };

    this.httpClient.patch("http://localhost:8000/user/update/" + this.medId, bodyData).subscribe((resultData: any) => {
      alert("Stock Updated")

    });
  }
  register() {
    let bodyData = {
      _id: this.medId,
      "medId": this.medId,
      "quantity": this.quantity
    };
    this.httpClient.post("http://localhost:8000/user/create", bodyData).subscribe((resultData: any) => {
      console.log(resultData);
      alert("Stock Registered Successfully")
      //this.getAllEmployee();
      this._id = '';
      this.medId = '';
      this.quantity = '';
      this.getStock();
    });
  }
}