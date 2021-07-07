import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators'; 
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  API_URL: string = environment.apiUrl + "/stores";
  authSubject = new BehaviorSubject(false);
  currentValueChange: Subject<number> = new Subject<number>();
  constructor(private httpClient: HttpClient) { }
  total: number = 0;
  current: number = 0;

  setTotal(value: number):void {
    this.total = value;
    console.log(this.total);
  }

  resetUpload() {
    this.total = 0;
    this.current = 0;
  }

  getTotal(): number {
    return this.total;
  }

  saveDots(store: any): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN")
      })
    };
    return this.httpClient.post<any>(`${this.API_URL}/saveDots`, store, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code === 200) {
          this.current += 1;
          if(this.current == this.total) {
            this.current = 0;
          }
          this.currentValueChange.next(this.current);
        }
      },
      (err) => {
        console.log("Error al guardar registro numero: " + this.current);
      }
    ));
  }

  getAll(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN")
      })
    };
    return this.httpClient.get(`${this.API_URL}/getDots`,httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res) {
          console.log("Extracción de data ejecutada correctamente");
        }
      }
    ));
  };

  getAllWF(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN")
      })
    };
    return this.httpClient.get(`${this.API_URL}/getDotsWF`, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res) {
          console.log("Extracción de data ejecutada correctamente");
        }
      }
    ));
  };

  getFilteredBySector(code: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'sector':code.toString(),
        'token': localStorage.getItem("ACCESS_TOKEN")
      })
    };
    return this.httpClient.get(`${this.API_URL}/getFilteredDots`,httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res) {
          console.log("Extracción de data ejecutada correctamente");
        }
      }
    ));
  }
}
