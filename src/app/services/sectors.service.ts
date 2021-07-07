import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SectorsI } from '../interfaces/SectorsI';
import { tap } from 'rxjs/operators'; 
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SectorsService {
    API_URL: string = environment.apiUrl + "/sectors";
    authSubject = new BehaviorSubject(false);

    constructor(private httpClient: HttpClient) { }

    getParents(): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'token': localStorage.getItem("ACCESS_TOKEN") || ""
            })
          };
        return this.httpClient.get(`${this.API_URL}/getParents`, httpOptions)
        .pipe(tap(
            (res: any) => {
                if(res.code == 200) {
                    return res.parents;
                } 
            }
        ));;
    }

    getSectorsByParent(parent: number): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'parent':parent.toString(),
              'token': localStorage.getItem("ACCESS_TOKEN")
            })
        };
        return this.httpClient.get(`${this.API_URL}/getSectors`, httpOptions)
        .pipe(tap(
            (res: any) => {
                if(res.code == 200) {
                    return res.sectors;
                } 
            }
        ));;
    }

    getSector(sector: number): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'sector':sector.toString(),
              'token': localStorage.getItem("ACCESS_TOKEN")
            })
        };
        return this.httpClient.get(`${this.API_URL}/getSector`, httpOptions)
        .pipe(tap(
            (res: any) => {
                if(res.code == 200) {
                    return res;
                } 
            }
        ));;
    }
}
