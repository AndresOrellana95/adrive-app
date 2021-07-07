import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserI } from '../interfaces/UserI';
import { JwtResponseI } from '../interfaces/JwtResponseI';
import { tap } from 'rxjs/operators'; 
import { Observable, BehaviorSubject } from 'rxjs';
import { EmployeeI } from '../interfaces/EmployeeI';
import { Router } from '@angular/router';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL: string = environment.apiUrl;
  authSubject = new BehaviorSubject(false);
  private token: string;

  constructor(private httpClient: HttpClient, private router: Router,
    private cacheService: CacheService) { }

  getLevelCodes(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || ""
      })
    };
    return this.httpClient.get<any>(`${this.API_URL}/user/levels`, httpOptions)
      .pipe(tap(
        (res: any) => {
          if(res.code != 200) {
            console.log("Error al obtener registros de niveles");
          }
        },
        (err) => {
          console.log("Error al obtener registros de niveles");
        }
      ));
  }

  register(user: UserI): Observable<JwtResponseI> {
    return this.httpClient.post<JwtResponseI>(`${this.API_URL}/register`, user)
    .pipe(tap(
      (res: JwtResponseI) => {
        if(res) {
          this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn);
        }
      }
    ));
  }

  login(user: EmployeeI): Observable<JwtResponseI> {
    return this.httpClient.post<JwtResponseI>(`${this.API_URL}/login`, user)
    .pipe(tap(
      (res: JwtResponseI) => {
        if(res) {
          this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn);
        }
      }
    ));
  }

  logout(): void {
    this.token ='';
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_INT");
  }

  private saveToken(token: string, expiresIn: string): void {
    localStorage.setItem('ACCESS_TOKEN', token);
    localStorage.setItem('EXPIRES_IN', expiresIn);
    this.cacheService.setToken(token);
    this.token = token;
  }

  private getToken(): string {
    if(!this.token) {
      this.token = localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token;
  }
}
