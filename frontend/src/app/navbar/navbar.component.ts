import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isMenuOpen: boolean = false;
  isPatient: boolean = false;
  isAdmin: boolean = false;
  public user: any;
  public checkUser: any;
  public role: any;
  private token: any;

  constructor(private router : Router, private cdr: ChangeDetectorRef, private httpClient: HttpClient){
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.detectChanges();
  }
  
  ngOnInit(): void {
    this.router.events // detect changes when navigation to another page ends.
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateUserRole();
        this.detectChanges();
        this.getCurrentUser();
      });
    this.updateUserRole();
    this.detectChanges();
  }

  private updateUserRole() {
    const role = sessionStorage.getItem('role');
    if (role === 'Patient') {
      this.isPatient = true;
      this.isAdmin = false;
    } else if (role === 'Admin') {
      this.isPatient = false;
      this.isAdmin = true;
    } else {
      this.isPatient = false;
      this.isAdmin = false;
    }
  }

  logout(){
    sessionStorage.clear();
    this.updateUserRole();
    this.detectChanges();
  }
  
   private detectChanges() {
    this.cdr.detectChanges();
  }


  //force kick user if amendments to session.
  getCurrentUser(): void {
    const body = { userid: this.user.user_id };

    this.httpClient.put<any>('http://localhost:3300/getCurrentUser', body).subscribe(
      response => {
        this.checkUser = response;
        this.checkUserRole();
      },
      error => {
        console.error('Error retrieving current user:', error);
      }
    );
  }

  checkUserRole(): void {
    this.token = sessionStorage.getItem('token');
    const userinfo = new JwtHelperService().decodeToken(this.token);
    this.user = userinfo.fn.user;

    this.role = sessionStorage.getItem('role');

    const userRole = this.checkUser && this.checkUser.role ? this.checkUser.role.trim().toLowerCase() : null;
    const sessionRole = this.role ? this.role.trim().toLowerCase() : null;

    if (userRole && sessionRole && userRole !== sessionRole) {
      this.logout();
      this.router.navigate(['/home']);
    }
  }

}
