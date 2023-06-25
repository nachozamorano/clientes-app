import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, catchError, map, throwError, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = "http://localhost:8080/api/clientes";
  private httpHeaders = new HttpHeaders({"Content-type":"application/json"});

  constructor(private http: HttpClient, private router: Router) { }
  
  getClientes(): Observable<Cliente[]>{
      return this.http.get(this.urlEndPoint).pipe(
        map(
          response =>{
            let clientes = response as Cliente[];
            return clientes.map(cliente => {
              cliente.nombre = cliente.nombre.toUpperCase();
              //cliente.createAt = formatDate(cliente.createAt,"EEEE dd, MMMM yyyy", "es");
              return cliente;
            });
          }
        )
      );
  }
  create(cliente:Cliente):Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, {headers : this.httpHeaders}).pipe(
      map( (response : any) => response.cliente as Cliente ),
      catchError(e => {

        if(e.status == "400"){
          return throwError(e);
        }

        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  getCliente(id: any): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );;
  }
  update(cliente:Cliente):Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente,{headers : this.httpHeaders}).pipe(
      catchError(e => {

        if(e.status == "400"){
          return throwError(e);
        }

        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  delete(id:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`,{headers : this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
