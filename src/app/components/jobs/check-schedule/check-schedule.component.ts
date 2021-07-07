import { Component, OnInit } from '@angular/core';
import { GeoLocationService } from '../../../services/geo-location.service';
import { ManageService } from '../../../services/manage.services';
import { CacheService } from '../../../services/cache.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-check-schedule',
  templateUrl: './check-schedule.component.html',
  styleUrls: ['./check-schedule.component.css']
})
export class CheckScheduleComponent implements OnInit {
  //Initial Central Point
  active: number = 1;
  latitude = 13.7013266;
  longitude = -89.2255933;
  dotList = [];
  employeeCode: string;
  calculateDistance: boolean = false;
  selectedDot = {} as any;
  initDot = {} as any;
  teamId: number;
  actualPos: Position;
  distanceKM: number;
  destination = {} as any;
  origin = {} as any;
  jobList = [] as any;
  scheduleid: number;

  constructor(private manageService: ManageService,
    private geoLocation: GeoLocationService,
    private cacheService: CacheService,
    private router: Router) { 
  }

  async ngOnInit() {
    let tokenLS = localStorage.getItem("ACCESS_TOKEN")
    if(tokenLS && tokenLS !== "undefined") {
      let decoded = jwt_decode(tokenLS);
      if(decoded.code) {
        this.collectData(decoded);
      }
    } else {
      let tokenSDB;
      await this.cacheService.getToken().toPromise().then((resp:any) => { tokenSDB = resp; });
      if(tokenSDB) {
        let decoded = jwt_decode(tokenSDB);
        if(decoded.code) {
          this.collectData(decoded);
        }
      }
    }
    //this.getInitPosition();
  }

  collectData(decoded: any) {
    this.employeeCode = decoded.code;
    this.cacheService.getJobList().subscribe(
      async (resp: any) => {
        if(resp) {
          if(resp.length > 0) {
            let counter = 0;
            let tmpJobList = Object.assign([], resp);
            let indexs = [];
            for(let i = 0; i <= resp.length - 1; i++) {
              let value = await this.manageService.saveJob(resp[i]).toPromise().then(
                (respJ: any) => {
                  if(respJ.code == 200) {
                    indexs.push(i);
                    return true;
                  }
                },
                (error) => {
                  return false;
                }
              );
              if(value) {
                counter++;
              }
            }
            tmpJobList = tmpJobList.filter( (v,i) => {
              return indexs.indexOf(i) == -1;
            });
            if(tmpJobList.length == 0) {
              this.cacheService.setJobList([]);
            } else {
              this.cacheService.setJobList(tmpJobList);
            }
            this.getDataProcess(this.employeeCode);
          } else {
            this.getDataProcess(this.employeeCode);
          }
        } else {
          this.getDataProcess(this.employeeCode);
        }
      },
      (error) => {
        this.getDataProcess(this.employeeCode);
      }
    );
    this.cacheService.getTimesTampValues().subscribe(
      async (resp: any) => {
        if(resp) {
          if(resp.length > 0) {
            let counter = 0;
            let tmpBinnacle = Object.assign([], resp);
            let indexs = [];
            for(let i = 0; i <= resp.length - 1; i++) {
              let value = await this.manageService.registerTimeStamp(resp[i]).toPromise().then(
                (respB: any) => {
                  if(respB.code == 200) {
                    indexs.push(i);
                    return true;
                  }
                },
                (error) => {
                  return false;
                }
              );
            }
            tmpBinnacle = tmpBinnacle.filter( (v, i) => {
              return indexs.indexOf(i) == -1;
            });
            this.cacheService.setTimesTampValues(tmpBinnacle);
          }
        }
      }
    );
  }

  getDataProcess(code) {
    this.manageService.getScheduleJobs(code).subscribe(
      (res) => {
        if(res.code == 200) {
          //consultar servicio remoto
          this.scheduleid = res.response.schedule.id;
          this.cacheService.setScheduleInfo(res.response);
          this.getDataFromBackend(res.response);
        } else {
          console.log(res.message);
        }
      },
      (error) => {
        //adquiriendo de cache
        this.cacheService.getScheduleInfo().subscribe(
          (resp: any) => {
            this.scheduleid = resp.schedule.id;
            this.getDataFromBackend(resp);
          }
        );
      }
    );
  }

  async getDataFromBackend(response) {
    this.teamId = response.teamId;
    let jobTMP = response.jobs;
    let dotsColl = response.schedule.route;
    /*jobTMP.forEach(element => {
      let match = dotsColl.find(f => { return f.id == element.StoreId });
      if(match) {
        match.visible = true;
        match.selected = false;
        this.dotList.push(match);
        element.storeInfo = match;
      }
    });*/
    for(let i = 0; i <= jobTMP.length - 1; i++) {
      let match = dotsColl.find(f => { return f.id == jobTMP[i].StoreId });
      if(match) {
        match.visible = true;
        match.selected = false;
        this.dotList.push(match);
        //jobTMP[i].storeInfo = match;
      }
    }
    this.jobList = jobTMP;
    this.manageService.getTotalAvailable(this.teamId).subscribe(
      (resp: any) => {
        if(resp.code == 200) {
          this.cacheService.setTotalValues(resp.totalAvailable);
        }
      },
      (error) => {
        console.log("Error al consultar valores disponibles " + error.message);
      }
    );
    this.manageService.getLastRatios(this.teamId).subscribe(
      (resp) => {
        if(resp.code == 200) {
          if(resp.ratios[0]) {
            this.cacheService.setRatioValues(resp.ratios[0]);
          } else {
            Swal.fire('Oops...', 'Sin razon para las pinturas, comuniquese con su supervisor', 'error');
          }
        }
      }
    );
    this.manageService.getTimesStamp(response.schedule.id).subscribe(
      (resp: any) => {
        if(resp.code == 200) {
          this.cacheService.setBinnacles(resp.arrivals);
        }
      },
      (error) => {
        console.log("Error al consultar registros guardados de la ruta");
      }
    );
  }

  requestResponse(event) {
    let distanceArray = event.routes[0].legs;
    let meters = 0;
    for(let i = 0; i <= distanceArray.length - 1; i++) {
      meters += distanceArray[i].distance.value;
    }
    this.distanceKM = parseFloat((meters / 1000).toFixed(2));
  }

  getInitPosition() {
    /*this.geoLocation.getPosition().subscribe(
      res => {
        this.actualPos = res;
        this.initDot = {
          lat: this.actualPos.coords.latitude, lng: this.actualPos.coords.longitude
      },
      (error) => {
        console.log(error);
      }
    });*/
  }

  checkLocation(event) {
      this.selectedDot = this.dotList.find( 
        (x) => { return x.latitude == event.latitude && x.longitude == event.longitude } );
      this.selectedDot.visible = true;
  }

  calculateDist() {
    if(this.selectedDot.visible) {
      navigator.geolocation.getCurrentPosition(
        res => {
          this.actualPos = res;
          this.initDot = {
            lat: this.actualPos.coords.latitude, lng: this.actualPos.coords.longitude
          };
          this.origin = Object.assign({}, this.initDot);
          this.destination = { lat: parseFloat(this.selectedDot.latitude), lng: parseFloat(this.selectedDot.longitude) };
          this.calculateDistance = true;
      });
      this.origin = Object.assign({}, this.initDot);
      this.destination = { lat: parseFloat(this.selectedDot.latitude), lng: parseFloat(this.selectedDot.longitude) };
      this.calculateDistance = true;
    } else {
      Swal.fire('Oops...', 'Debe seleccionar una tienda', 'error')
    }
  }

  registerTimestamp() {
    if(this.selectedDot.visible) {
      navigator.geolocation.getCurrentPosition(
        res => {
          this.actualPos = res;
          this.initDot = {
            lat: this.actualPos.coords.latitude, lng: this.actualPos.coords.longitude
          };
          let date = new Date();
          let day = date.getDate();
          let month = date.getMonth();
          let year = date.getFullYear();
          let hour = date.getHours();
          let minutes = date.getMinutes();
          let seconds = date.getSeconds();
          let dateTime = new Date(year, month, day, hour, minutes, seconds).getTime();
          let binnacle = {
            employee: this.employeeCode,
            localCreation: dateTime,
            latitude: this.initDot.lng,
            longitude: this.initDot.lat,
            storeCode: this.selectedDot.code,
            schedule: this.scheduleid
          };
          this.cacheService.getBinnacles().toPromise().then(
            (bins: any) => {
              let control = false;
              if(bins.length > 0) {
                control = bins.some(f => { return f.storeCode == binnacle.storeCode });
                if(control) {
                  Swal.fire('Error','Ya ha registrado la bitácora para esta tienda','error');
                } 
              } else {
                bins = [];
              }
              if(!control) {
                
                this.manageService.registerTimeStamp(binnacle).subscribe(
                  (resp: any) => {
                    if(resp.code == 200) {
                      bins.push(binnacle);
                      this.cacheService.setBinnacles(bins);
                      Swal.fire('Éxito','Registro guardado','success');
                    }
                  },
                  (error) => {
                    this.cacheService.getTimesTampValues().subscribe(
                      (resp: any) => {
                        let binnacleList = [];
                        if(resp) {
                          binnacleList = resp;
                        }
                        binnacleList.push(binnacle);
                        bins.push(binnacle);
                        this.cacheService.setBinnacles(bins);
                        this.cacheService.setTimesTampValues(binnacleList);
                        Swal.fire('Éxito','Registro guardado','success');
                      },
                      (error) => {
                        let binnacleList = [];
                        binnacleList.push(binnacle);
                        bins.push(binnacle);
                        this.cacheService.setBinnacles(bins);
                        this.cacheService.setTimesTampValues(binnacleList);
                        Swal.fire('Éxito','Registro guardado','success');
                      }
                    );
                  }
                );
              }
            }
          );
      });
    } else {
      Swal.fire('Oops...', 'Debe seleccionar una tienda', 'error');
    }
  }

  async goToRegisterJob(code, store) {
    let validation = this.cacheService.getBinnacles().toPromise().then(
      (resp: any) => {
        if(resp) {
          if(resp.length > 0) {
            let control = resp.some(f => { return f.storeCode == store });
            if(control) {
              this.router.navigate(['/jobs/register', { jobid: code }]);
            }
          } else {
            Swal.fire('Error...', 'Debe hacer el registro en la pantalla del mapa para esta tienda', 'error');
          }
        } else {
          Swal.fire('Error...', 'Debe hacer el registro en la pantalla del mapa para esta tienda', 'error');
        }
      }
    );
    
  }

  async cerrarSesion() {
    await this.cacheService.deleteToken().toPromise().then(() => {});
    localStorage.removeItem('ACCESS_TOKEN');
    this.router.navigate(['/auth']);
  }
}
