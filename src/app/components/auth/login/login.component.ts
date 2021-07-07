import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeI } from '../../../interfaces/EmployeeI';
import { AuthService } from '../../../services/auth.service';
import { CacheService } from '../../../services/cache.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    code: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService,
    private router: Router, private cacheService: CacheService) { }

  async ngOnInit() {
    let token = "";
    await this.cacheService.getToken().toPromise().then((resp: any) => { token = resp; });
    if(token) {
      let decoded = jwt_decode(token);
      if(decoded.role) {
        if(decoded.role != 2) {
          this.router.navigate(['/teams/control']);
        } else {
          this.router.navigate(['/jobs/schedule']);
        }
      }
    }
  }

  onLogin(form: any):void {
    let empI = {} as EmployeeI;
    empI.code = form.value.code;
    empI.password = form.value.password;
    this.authService.login(empI).subscribe( 
      (res: any) => {
        if(res.dataUser.code == 200) {
          if(res.dataUser["role"] == 1 || res.dataUser["role"] == 3) {
            this.router.navigateByUrl('/teams/control');
          } else {
            this.router.navigateByUrl('/jobs/schedule');
          }
        } else {
          Swal.fire('Oops...', 'Credenciales incorrectas', 'error');
        }
      },
      (error) => {
        if(error.status == 401) {
          Swal.fire('Oops...', 'Credenciales incorrectas', 'error');
        } else if(error.status == 403) {
          Swal.fire('Oops...', 'Sin acceso a la plataforma', 'error');
        } else if(error.status == 404) {
          Swal.fire('Oops...', 'Usuario no encontrado', 'error');
        }
      }
    );
  }
}
