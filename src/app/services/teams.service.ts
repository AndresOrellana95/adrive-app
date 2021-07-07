import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators'; 
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
    API_URL: string = environment.apiUrl;
    authSubject = new BehaviorSubject(false);
    constructor(private httpClient: HttpClient) { }
    
    createCar(car: any): any{
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'token': localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.post<any>(`${this.API_URL}/cars/create`, car, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error al guardar registro de vehiculo");
          }
        },
        (err) => {
          console.log("Error al guardar registro de vehiculo");
        }
      ));
    }

    getAllCars(): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'token': localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.get<any>(`${this.API_URL}/cars/getAll`, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error el obtener registros de vehiculos");
          }
        },
        (err) => {
          console.log("Error el obtener registros de vehiculos");
        }
      ));
    }

    getAllCarsWF(): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'token': localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.get<any>(`${this.API_URL}/cars/getAllWF`, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error el obtener registros de vehiculos");
          }
        },
        (err) => {
          console.log("Error el obtener registros de vehiculos");
        }
      ));
    }

    getByCode(code: string): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          code: code,
          token: localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.get<any>(`${this.API_URL}/cars/filterCar`, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error el obtener registros de vehiculos");
          }
        },
        (err) => {
          console.log("Error el obtener registros de vehiculos");
        }
      ));
    }

    getByCodeWF(code: string): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          code: code,
          'token': localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.get<any>(`${this.API_URL}/cars/filterCarWF`, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error el obtener registros de vehiculos");
          }
        },
        (err) => {
          console.log("Error el obtener registros de vehiculos");
        }
      ));
    }

    createEmployee(employee: any): any{
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          token: localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.post<any>(`${this.API_URL}/employees/create`, employee, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error al guardar registro de empleado");
          }
        },
        (err) => {
          console.log("Error al guardar registro de Empleado");
        }
      ));
    }

    getAllEmployess(): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'token': localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.get<any>(`${this.API_URL}/employees/getAll`,httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error el obtener registros de empleados");
          }
        },
        (err) => {
          console.log("Error el obtener registros de empleados");
        }
      ));
    }

    getEmployeeByCode(code: string): any {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          code: code,
          'token': localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.get<any>(`${this.API_URL}/employees/getByCode`,httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error el obtener registros de empleados");
          }
        },
        (err) => {
          console.log("Error el obtener registros de empleados");
        }
      ));
    }

    getAvailable(level: number): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          level: level.toString(),
          'token': localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.get<any>(`${this.API_URL}/employees/getAvailable`, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error el obtener registros de empleados");
          }
        },
        (err) => {
          console.log("Error el obtener registros de empleados");
        }
      ));
    }

    createTeam(team: any): Observable<any>{
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'token': localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.post<any>(`${this.API_URL}/manage/createT`, team, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error al guardar registro de equipo");
          }
        },
        (err) => {
          console.log("Error al guardar registro de equipo");
        }
      ));
    }

    getAllTeams(): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'token': localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.get<any>(`${this.API_URL}/manage/getAllT`, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error el obtener registros de equipos");
          }
        },
        (err) => {
          console.log("Error el obtener registros de equipos");
        }
      ));
    }

    getAllDistinctTeams(): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'token': localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.get<any>(`${this.API_URL}/manage/getDistinctTeams`, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error el obtener registros de equipos");
          }
        },
        (err) => {
          console.log("Error el obtener registros de equipos");
        }
      ));
    }

    filterTeamByDate(): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'token': localStorage.getItem("ACCESS_TOKEN")
        })
      };
      return this.httpClient.post<any>(`${this.API_URL}/manage/getTeamsByDate`, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error el obtener registros de equipos");
          }
        },
        (err) => {
          console.log("Error el obtener registros de equipos");
        }
      ));
    }
}
