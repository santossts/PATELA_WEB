import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

  //private apiUrl = 'http://localhost:8080/api';
  private apiUrl = 'https://patela-frond-dz92.onrender.com/api' ;
  //https://patela-frond-dz92.onrender.com

  constructor(
    private http: HttpClient
  ) 
    { }

  guardarSolicitud(data: any): Observable<any> { 
    return this.http.post(this.apiUrl + '/solicita', data); 
  }

  listarSolicitudes(): Observable<any[]> { 
    return this.http.get<any[]>(this.apiUrl + '/listar') ; 
  }

  almacenarSubProcesos(data: any, id:number): Observable<any> {
    return this.http.post(this.apiUrl + '/almacenar-subprocesos/' + id, data);
  }

  listaDeSubtareas(idSolicitud: number): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl + '/solicitud/' + idSolicitud);
  }

  finalizarRegistro(id: number): Observable<any>{
    return this.http.put<any>(this.apiUrl + '/finalizar/' + id, {});
  }

  obtenerResumen(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumen`);
  }

  getResumenAnual(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/resumen-anual');
  }

  login(data:any){
    return this.http.post(this.apiUrl + '/login', data);      
  }

  descargarReporte() {
    return this.http.get(this.apiUrl + '/reporte/excel', {responseType: 'blob'  });
  }

}
