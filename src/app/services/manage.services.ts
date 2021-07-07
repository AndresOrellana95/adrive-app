import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators'; 
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageService {
  API_URL: string = environment.apiUrl + "/manage";
  authSubject = new BehaviorSubject(false);
  constructor(private httpClient: HttpClient) { }
  
  createSchema(schema: any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || ""
      })
    };
    return this.httpClient.post<any>(`${this.API_URL}/createSch`, schema, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al registrar tarea");
        }
      },
      (err) => {
        console.log("Error al registrar tarea");
      }
    ));
  }

  //getActiveSch
  getActiveSchedule(): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || ""
      })
    };
    return this.httpClient.get<any>(`${this.API_URL}/getActiveSch`, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al consultar equipo asignado");
        }
      },
      (err) => {
        console.log("Error al consultar equipo asignado");
      }
    ));
  }

  getScheduleByTeamCode(code: number): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || "",
        teamid: code.toString()
      })
    };
    return this.httpClient.get<any>(`${this.API_URL}/getScheduleByTeamCode`, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al consultar equipo asignado");
        }
      },
      (err) => {
        console.log("Error al consultar equipo asignado");
      }
    ));
  }

  getTeamHistoryProducts(code: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || "",
        'id': code.toString()
      })
    };
    return this.httpClient.get<any>(`${this.API_URL}/getTeamProds`, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al consultar equipo asignado");
        }
      },
      (err) => {
        console.log("Error al consultar equipo asignado");
      }
    ));
  }

  //assignProducts
  assignProducts(code: number, form: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || ""
      })
    };
    form.TeamId = code;
    form.picture1 = (form.picture1) ? 1 : 0;
    form.picture2 = (form.picture2) ? 1 : 0;
    form.picture3 = (form.picture3) ? 1 : 0;
    form.picture4 = (form.picture4) ? 1 : 0;
    form.picture5 = (form.picture5) ? 1 : 0;
    form.picture6 = (form.picture6) ? 1 : 0;
    let body = { record: form }
    return this.httpClient.post<any>(`${this.API_URL}/assignProducts`, body, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al asignar productos");
        }
      },
      (err) => {
        console.log("Error al asignar productos");
      }
    ));
  }

  //setRatioTeam
  setRatioTeam(ratios: any, code: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || ""
      })
    };
    ratios.TeamRatioId = code;
    let body = { ratios }
    return this.httpClient.post<any>(`${this.API_URL}/setRatioTeam`, body, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al asignar razones a pinturas");
        }
      },
      (err) => {
        console.log("Error al asignar razones a pinturas");
      }
    ));
  }

  //getLastRatios
  getLastRatios(code: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || "",
        'teamid': code.toString()
      })
    };
    return this.httpClient.get(`${this.API_URL}/getLastRatios`, httpOptions)
    .pipe(timeout(20000));
  }

  getScheduleJobs(code: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || "",
        'code': code
      })
    };
    return this.httpClient.get(`${this.API_URL}/getScheduleJobs`, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al consultar tareas de la tura");
        }
      },
      (err) => {
        console.log("Error al consultar tareas de la ruta");
      }
    ));
  }

  clearSchedule(teamid: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || "",
        'teamid': teamid.toString()
      })
    };
    return this.httpClient.get(`${this.API_URL}/clearSchedule`, httpOptions)
    .pipe();
  }

  getJobDetails(code: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || "",
        'code': code.toString()
      })
    };
    return this.httpClient.get(`${this.API_URL}/getJobDetails`, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al consultar detalle de tarea de la ruta");
        }
      },
      (err) => {
        console.log("Error al consultar detalle de tarea de la ruta");
      }
    ));
  }

  getTotalAvailable(code: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || "",
        'id': code.toString()
      })
    };
    return this.httpClient.get(`${this.API_URL}/getTotalAvailable`, httpOptions)
    .pipe(timeout(20000));
  }

  saveJob(job: any) {
    console.log(job);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || ""
      })
    };
    return this.httpClient.post(`${this.API_URL}/saveJobState`, job, httpOptions)
    .pipe(timeout(20000));
  }

  getAllJobs() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || ""
      })
    };
    return this.httpClient.get(`${this.API_URL}/getAllJobs`, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al consultar tareas");
        }
      },
      (err) => {
        console.log("Error al consultar tareas");
      }
    ));
  }

  getAllJobsByDate(date: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || "",
      })
    };
    let datetime = {
      date: date
    }
    return this.httpClient.post(`${this.API_URL}/getAllJobsByDate`, datetime, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al consultar tareas");
        }
      },
      (err) => {
        console.log("Error al consultar tareas");
      }
    ));
  }

  registerTimeStamp(binnacle: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || "",
      })
    };
    return this.httpClient.post(`${this.API_URL}/setPlaceAndTimestamp`, binnacle, httpOptions)
    .pipe(timeout(15000));
  }

  getTimesStamp(schedule: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || "",
        id: schedule.toString()
      })
    };
    return this.httpClient.get(`${this.API_URL}/getArrivalSchedule`, httpOptions)
    .pipe(timeout(15000));
  }

  approveJob(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || ""
      })
    };
    return this.httpClient.post(`${this.API_URL}/markJobCompleted`, data, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al guardar estado de la tarea");
        }
      },
      (err) => {
        console.log("Error al guardar estado de la tarea");
      }
    ));
  }

  reescheduleJob(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': localStorage.getItem("ACCESS_TOKEN") || ""
      })
    };
    return this.httpClient.post(`${this.API_URL}/markJobReescheduled`, data, httpOptions)
    .pipe(tap(
      (res: any) => {
        if(res.code != 200) {
          console.log("Error al guardar estado de la tarea");
        }
      },
      (err) => {
        console.log("Error al guardar estado de la tarea");
      }
    ));
  }

  public jsonProductParse = [
    { key: 'Banner', value: 'picture1' },
    { key: 'Porta afiche', value: 'picture2' },
    { key: 'Afiche', value: 'picture3' },
    { key: 'Marco Lego', value: 'picture4' },
    { key: 'Glorificador', value: 'picture5' },
    { key: 'Banderola', value: 'picture6' },
    { key:"Alambre Galv.", value: "alambGalv" },
    { key:"Bandeja para rodillo", value: "bandejaRod" },
    { key:"Bidones", value: "bidones" },
    { key:"Broca concreto 3 / 16''", value: "brocaConc316" },
    { key:"Broca concreto 3 / 8''", value: "brocaCon38" },
    { key:"Broca concreto 5 / 16''", value: "brocaCon516" },
    { key:"Brocha 1 / 2''", value: "brocha05" },
    { key:"Brocha 1''", value: "brocha1" },
    { key:"Brocha 1 1 / 2''", value: "brocha112" },
    { key:"Brocha 2''", value: "brocha2" },
    { key:"Brocha 4''", value: "brocha4" },
    { key:"Brocha 6''", value: "brocha6" },
    { key:"Caja de herramientras roja", value: "cajaHerrRoja" },
    { key:"Cepillo de alambre", value: "cepAlambre" },
    { key:"Cincha plastica 14''", value: "cinchaPlast14" },
    { key:"Cinta métrica", value: "cintaMetrica" },
    { key:"Destornillador philips", value: "destPhilips" },
    { key:"Destornillador plano", value: "destPhilipsPlano" },
    { key:"Escalera extensible", value: "escaleraExt" },
    { key:"Escalera tijera", value: "escaleraTjr" },
    { key:"Escobas", value: "escobas" },
    { key:"Espatulas", value: "espatulas" },
    { key:"Extensión eléctrica", value: "extElectrica" },
    { key:"Extensiones rodillo", value: "extRodillo" },
    { key:"Felpas de 9'' Pared Lisa", value: "felpas9Plisa" },
    { key:"Felpas de 9'' Ormigon", value: "felpas9Or" },
    { key:"Hilo Nylon", value: "nylon" },
    { key:"Manerales para rodillo 9''", value: "manRodillo9" },
    { key:"Martillos", value: "martillo" },
    { key:"Nivel de Caja", value: "nivelCaja" },
    { key:"Pinzas", value: "pinzas" },
    { key:"Puntas Philips p/ Taladro", value: "pPhilipsTal" },
    { key:"Punta Plana P/ Taladro", value: "pPlanaTal" },
    { key:"Taladros", value: "taladro" },
    { key:"Cinta doble cara", value: "cintDobCara" },
    { key:"Clavo de acero 1''", value: "clavoAcr1" },
    { key:"Tornillo punta broca 1'' Hexagonal", value: "torBr1Hex" },
    { key:"Anclas plasticas 3 / 8'' azul", value: "aclaP38" },
    { key:"Wype", value: "wype" },
    { key:"Cubo N°8 para taladro", value: "cubo8Tal" },
    { key:"Solvente mineral", value: "solventeMin" },
    { key:"ItemPrv1", value: "itemPrv1" },
    { key:"ItemPrv2", value: "itemPrv2" },
    { key:"ItemPrv3", value: "itemPrv3" },
    { key:"ItemPrv4", value: "itemPrv4" },
    { key:"ItemPrv5", value: "itemPrv5" },
    { key:"ItemPrv6", value: "itemPrv6" },
    { key:"ItemPrv7", value: "itemPrv7" },
    { key:"ItemPrv8", value: "itemPrv8" },
    { key:"ItemPrv9", value: "itemPrv9" },
    { key:"ItemPrv10", value: "itemPrv10" },
    { key:"Blanca Latex", value: "blancaLtx" },
    { key:"Blanca brillante", value: "blancaBrill" },
    { key:"Blanca Optimus", value: "blancaOpt" },
    { key:"Amarilla Brillante", value: "amrBrill" },
    { key:"Azul brillante", value: "azulBrill" },
    { key:"Blanca anticorro", value: "blancaAntic" },
    { key:"Blanco top cover", value: "blancaTopCover" },
    { key:"Pin prov 1", value: "prinPrv1" },
    { key:"Pin prov 2", value: "prinPrv2" },
    { key:"Pin prov 3", value: "prinPrv3" },
    { key:"Pin prov 4", value: "prinPrv4" },
    { key:"Pin prov 5", value: "prinPrv5" },
  ];
}
