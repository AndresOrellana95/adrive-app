import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, timeout } from 'rxjs/operators'; 
import jwt_decode from 'jwt-decode';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthGuardService implements CanActivate {
  API_URL: string = environment.apiUrl + "/tokenValidate";
  authSubject = new BehaviorSubject(false);
  storedToken: string;

  constructor(public router: Router, private httpClient: HttpClient,
    private cacheService: CacheService) {

  }

  async canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    let flag = false;
    await this.isAuthenticated().toPromise().then( 
      (rep) => {
        if(rep.code == 200) {
          let decoded = jwt_decode(localStorage.getItem("ACCESS_TOKEN"));
          if(decoded.role) {
            if(route.data.role && route.data.role.indexOf(decoded.role) === -1) {
              this.router.navigate(['/auth']);
              return false;
            } 
            flag = true;
          } else {
            flag = false;
          }
        } else {
          flag = false;
          console.log("Sesión expirada");
        } 
      },
      async (error) => {
        if(error.status != 401) {
          //let decoded = jwt_decode(localStorage.getItem("ACCESS_TOKEN"));
          let decoded = {} as any;
          let val = await this.cacheService.getToken().toPromise().then( resp => { decoded = resp; });
          this.storedToken = decoded;
          decoded = jwt_decode(decoded);
          if(decoded.role) {
            if(route.data.role && route.data.role.indexOf(decoded.role) === -1) {
              this.router.navigate(['/auth']);
              return false;
            }
            localStorage.setItem("ACCESS_TOKEN", this.storedToken);
            flag = true;
          }
        } else {
          console.log("Necesita autenticacion");
        }
      }
    );
    if(!flag) {
      this.router.navigate(['/auth']);
    }
    return flag;
  }

  public isAuthenticated(): any {
    let token = localStorage.getItem("ACCESS_TOKEN") || "";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': token
      })
    };
    return this.httpClient.get(`${this.API_URL}`, httpOptions)
        .pipe(timeout(15000));;
    }
}
