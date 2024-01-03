import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminLoginService } from '../app/services/admin-login.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private adminLoginService: AdminLoginService, private router: Router) { }

  canActivate(): boolean {
    if (this.adminLoginService.currentAdminValue) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}

