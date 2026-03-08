import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   //private apiUrl = 'http://localhost:8080/api';
   private apiUrl = 'https://patela-frond-dz92.onrender.com/api' ;

  constructor(
    private http: HttpClient
  ) { }

  login(data:any): Observable<any>{
    return this.http.post(this.apiUrl + '/login', data );
  }
}
