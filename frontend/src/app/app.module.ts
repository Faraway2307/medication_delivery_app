import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ViewOrderRequestPopupComponent } from './view-order-request-popup/view-order-request-popup.component';
import { ViewOrderRequestComponent } from './view-order-request/view-order-request.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PatientRecordComponent } from './patient-record/patient-record.component';
import { InventoryComponent } from './inventory/inventory.component';
import { UserHomeComponent } from './user-home/user-home.component';

import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table'; 
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { CurrencyPipe } from '@angular/common';
import { MedicineComponent } from './medicine/medicine.component';
import { CreateAccountPopupComponent } from './create-account-popup/create-account-popup.component';
import { CreateMedicinePopupComponent } from './create-medicine-popup/create-medicine-popup.component';
import { CreatePatientMedicinePopupComponent } from './create-patient-medicine-popup/create-patient-medicine-popup.component';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StockRequestDialogComponent } from './stock-request-dialog/stock-request-dialog.component';
import { ViewPatientOrderStatusComponent } from './view-patient-order-status/view-patient-order-status.component';
import { ViewPatientOrderStatusPopupComponent } from './view-patient-order-status-popup/view-patient-order-status-popup.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserLoginPopupComponent } from './user-login-popup/user-login-popup.component';


import { MedicineListingPageComponent } from './medicine-listing-page/medicine-listing-page.component';

import { ChangeMobilePopupComponent } from './change-mobile-popup/change-mobile-popup.component';
import { ChangeEmailPopupComponent } from './change-email-popup/change-email-popup.component';
import { ChangeAddressPopupComponent } from './change-address-popup/change-address-popup.component';
import { MatExpansionModule} from '@angular/material/expansion';
import { SuccessPwdChangePopupComponent } from './success-pwd-change-popup/success-pwd-change-popup.component';
import { EncounterComponent } from './encounter/encounter.component';
import { CreateEncounterPopupComponent } from './create-encounter-popup/create-encounter-popup.component';
import { MakePaymentPopupComponent } from './make-payment-popup/make-payment-popup.component';
 
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AdminHomeComponent,
    ViewOrderRequestPopupComponent,
    ViewOrderRequestComponent,
    PatientRecordComponent,
    InventoryComponent,
    UserHomeComponent,
    

    MedicineComponent,
    CreateAccountPopupComponent,
    CreateMedicinePopupComponent,
    CreatePatientMedicinePopupComponent,
    RecentOrdersComponent,
    StockRequestDialogComponent,
    ViewPatientOrderStatusComponent,
    ViewPatientOrderStatusPopupComponent,
    UserProfileComponent,
    UserLoginPopupComponent,
  

    MedicineListingPageComponent,

    ChangeMobilePopupComponent,
    ChangeEmailPopupComponent,
    ChangeAddressPopupComponent,
    SuccessPwdChangePopupComponent,
    EncounterComponent,
    CreateEncounterPopupComponent,
    MakePaymentPopupComponent, 
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatStepperModule,
    MatFormFieldModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatTabsModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot(),
    MatSnackBarModule,
    MatExpansionModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
