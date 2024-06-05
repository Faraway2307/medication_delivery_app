import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ViewOrderRequestPopupComponent } from './view-order-request-popup/view-order-request-popup.component';
import { ViewOrderRequestComponent } from './view-order-request/view-order-request.component';
import { PatientRecordComponent } from './patient-record/patient-record.component';
import { InventoryComponent } from './inventory/inventory.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { MedicineComponent } from './medicine/medicine.component';
import { RecentOrdersComponent } from './recent-orders/recent-orders.component';
import { ViewPatientOrderStatusComponent } from './view-patient-order-status/view-patient-order-status.component';


import { MedicineListingPageComponent } from './medicine-listing-page/medicine-listing-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangeEmailPopupComponent } from './change-email-popup/change-email-popup.component';
import { ChangeMobilePopupComponent } from './change-mobile-popup/change-mobile-popup.component';
import { ChangeAddressPopupComponent } from './change-address-popup/change-address-popup.component';
import { guardNameGuard } from './guard-name.guard';
import { EncounterComponent } from './encounter/encounter.component';
import { CreateEncounterPopupComponent } from './create-encounter-popup/create-encounter-popup.component';

const routes: Routes = [
  // load the page by default to home
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path:'home',component:HomeComponent},
  {path: 'admin-home',component:AdminHomeComponent, canActivate: [guardNameGuard], data: {permission:["Admin"]}},
  {path: 'view-order-request',component:ViewOrderRequestComponent, canActivate: [guardNameGuard], data: {permission:["Admin"]}},
  {path: 'patient-record/:id',component:PatientRecordComponent, canActivate: [guardNameGuard], data: {permission:["Admin"]}},
  {path:'inventory',component:InventoryComponent, canActivate: [guardNameGuard], data: {permission:["Admin"]}},
  {path: 'user-home',component:UserHomeComponent, canActivate: [guardNameGuard], data: {permission:["Patient"]}},


  {path: 'medicine/:id', component:MedicineComponent, canActivate: [guardNameGuard], data: {permission:["Admin"]}},
  {path: 'recent-orders', component:RecentOrdersComponent, canActivate: [guardNameGuard], data: {permission:["Patient"]}},
  {path: 'view-patient-order-status', component:ViewPatientOrderStatusComponent, canActivate: [guardNameGuard], data: {permission:["Patient"]}},


  {path: 'medicine-listing-page', component:MedicineListingPageComponent, canActivate: [guardNameGuard], data: {permission:["Patient"]}},
  {path: 'user-profile', component:UserProfileComponent, canActivate: [guardNameGuard], data: {permission:["Patient","Admin"]}},
  {path: 'change-email-popup', component:ChangeEmailPopupComponent, canActivate: [guardNameGuard], data: {permission:["Patient","Admin"]}},
  {path: 'change-mobile-popup', component:ChangeMobilePopupComponent, canActivate: [guardNameGuard], data: {permission:["Patient","Admin"]}},
  {path: 'change-address-popup', component:ChangeAddressPopupComponent, canActivate: [guardNameGuard], data: {permission:["Patient","Admin"]}},
  {path: 'encounter/:id', component:EncounterComponent, canActivate: [guardNameGuard], data: {permission:["Admin"]}}
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
