import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})

class PermissionsService {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = sessionStorage.getItem('token');
    const userRoles = sessionStorage.getItem('role');

    if (token && userRoles) {
      // Token and user roles are present
      const allowedRoles = route.data['permission'];
      const userHasPermission = allowedRoles.includes(userRoles);
      
      if (userHasPermission) {
        if(state.url === '/home'){
          if(userRoles === 'Patient'){
            this.router.navigate(['/user-home']);
          }
          else if(userRoles === 'Admin'){
            this.router.navigate(['/admin-home']);
          }
        }
        // User has permission, allow access to the route
        return true;
      } else {
        // User does not have permission, redirect to unauthorized page or show a message
        if(userRoles === 'Patient'){
          this.router.navigate(['/user-home']);
        }
        else if(userRoles === 'Admin'){
          this.router.navigate(['/admin-home']);
        }
        return false;
      }
    }
    else{
      // Token or user roles are not present, redirect to login page
      this.router.navigate(['/home']);
      return false;
    }
  }
}

export const guardNameGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(PermissionsService).canActivate(route, state);
}

