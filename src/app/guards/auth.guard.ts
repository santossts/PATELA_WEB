import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
//import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router:Router){}

  canActivate(): boolean {

    const usuario = localStorage.getItem('usuario');

    if(usuario){
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
  
}
