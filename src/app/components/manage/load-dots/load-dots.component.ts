import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { GeoLocationService } from '../../../services/geo-location.service';
import { SectorsService } from './../../../services/sectors.service';
import { TeamService } from '../../../services/teams.service';
import { StoreI } from '../../../interfaces/StoreI';
import { SectorsI } from '../../../interfaces/SectorsI';
import { NgbProgressbarConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { CacheService } from '../../../services/cache.service';
import { ManageService } from '../../../services/manage.services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-load-dots',
  templateUrl: './load-dots.component.html',
  styleUrls: ['./load-dots.component.css']
})
export class LoadDotsComponent implements OnInit {
  active = 1;
  selectedDot = {} as StoreI;
  dotList: StoreI[] = [];
  parents: SectorsI[] = [];
  sectors: SectorsI[] = [];
  showingSector: SectorsI;
  selectedParent: number;
  selectedSector: number;
  //Initial Central Point
  latitude = 13.7013266;
  longitude = -89.2255933;
  actualPos: Position;
  //save dots
  arrayBuffer:any;
  file:File;
  dataUpload = {} as any;
  progress = 0;
  auxTotal = 0;
  @ViewChild("successLoad") modalRef: TemplateRef<any>;
  teamList = [] as any;
  headList = [] as any;
  date: any;
  selectDots: boolean = false;
  assignStoreColl = [] as any;
  pageH = 1;
  pageSizeH = 10;
  headListT = [];
  buttonString = "Seleccionar puntos";
  origin = {} as any;
  waypointsSelect = false;
  initDot = {} as any;
  lastDot = {} as any;
  waypointsCalculate = [];
  distanceKM = 0;
  checkDots = false;
  tmpHoverInfo = {} as any;

  constructor(private storeService: StoreService,
    private sectorsService: SectorsService,
    private teamService: TeamService,
    private progressBarService: NgbProgressbarConfig,
    private locationService: GeoLocationService,
    private manageService: ManageService,
    private modalService: NgbModal,
    private cacheService: CacheService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.dotList = [];
    this.sectors = [];
    this.selectedDot = {} as StoreI;
    this.getAllStore();
    this.getSectorParents();
    this.getInitLocation();
    this.getAllTeams();
    this.storeService.currentValueChange.subscribe((value) => {
      this.progress = value;
      if(this.progress == 0) {
        this.auxTotal = this.progressBarService.max;
        this.storeService.resetUpload();
        this.progressBarService.max = 0;
        if(!this.modalService.hasOpenModals()) {
          this.modalService.open(this.modalRef, { size: 'sm' });
        }
      }
    });
  }

  manageStock() {
    this.router.navigate(['/manage/stock']);
  }

  manageTeams() {
    this.router.navigate(['/teams/control']);
  }

  refreshTeams() {
    this.headListT = this.headList
      .map((head, i) => ({ident: i + 1, ...head}))
      .slice((this.pageH - 1) * this.pageSizeH, (this.pageH - 1) * this.pageSizeH + this.pageSizeH);
  }

  fileChangeListener(event: any): void {
    {
      this.file= event.target.files[0]; 
    }
  }

  convertDMStoCartesian(degrees: string, type: number):string {
    let longIndex = [0,2,2,4,4,(degrees.length - 1), degrees.length];
    let latIndex = [0,2,2,4,4,(degrees.length - 1),degrees.length];
    let arrayIndex = (type === 1) ? latIndex : longIndex;
    let grade = degrees.substring(arrayIndex[0],arrayIndex[1]);
    grade = (type == 0) ? grade.substring(1) : grade;
    let minutes = parseFloat(degrees.substring(arrayIndex[2],arrayIndex[3]));
    let seconds = degrees.substring(arrayIndex[4],arrayIndex[5]);
    seconds = seconds.substring(0,2) + "." + seconds.substring(2);
    let secondsFloat = parseFloat(seconds);
    let vector = degrees.substr(arrayIndex[5], arrayIndex[6]);
    let resultValue = ((minutes / 60) + (secondsFloat / 3600)).toFixed(8);
    resultValue = grade + "." + resultValue.substring(2);
    if(vector === "S" || vector === "W") {
      resultValue = "-" + resultValue;
    }
    return resultValue;
  }

  dataToDB() {
    this.dataUpload = {};
    let fileReader = new FileReader();
      fileReader.onload = async (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          this.dataUpload = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          this.storeService.resetUpload();
          this.storeService.setTotal(this.dataUpload.length);
          this.progressBarService.max = this.dataUpload.length;
          for(let value of this.dataUpload) {
            value.CodTienda = value.Codigo;
            value.Tienda = value.Cliente;
            value.Cliente = value["Contacto Cliente"];
            value.Telefono = value["Telefono Cliente"];
            value.Telefono2 = value["Telefono Cliente 2"];
            value.Dir1 = value["Direccion 1"]; 
            value.Dir2 = value["Direccion 2"];
            value.Dir3 = value["Direccion 3"];
            value.longitude = this.convertDMStoCartesian(value.Longitud.trim(), 1);
            value.latitude = this.convertDMStoCartesian(value.Latitud.trim(), 1);
            value.department = value["ID DPTO"];
            value.sector = value["ID MUN"];
            let saved = await this.storeService.saveDots(value).toPromise().then(
              (res) => {
                if(res.code != 200) {
                  console.log("Error en el registro: " + this.progress);
                }
              },
              (error) => {
                console.log("Error al persistir registro");
              }
            );
          };
          this.getAllStore();
      }
      fileReader.readAsArrayBuffer(this.file);
  }

  checkLocation(event) {
    if(!this.selectDots) {
      this.selectedDot = this.dotList.find( (x) => { return x.latitude == event.latitude && x.longitude == event.longitude } );
      this.selectedDot.visible = true;
    } else {
      this.selectedDot = {} as StoreI;
      let selected = {};
      this.dotList.forEach( x => {
        if(x.latitude == event.latitude && x.longitude == event.longitude) {
          x.visible = false;
          selected = x;
        }
      });
      this.assignStoreColl.push(selected);
    }
  }

  getInitLocation() {
    /*this.locationService.getPosition().subscribe(res => {
      this.actualPos = res;
      this.origin = {
        lat: this.actualPos.coords.latitude, lng: this.actualPos.coords.longitude
      }
    });*/
  }

  getAllStore() {
    this.storeService.getAllWF().subscribe(res => {
      this.dotList = res.dotsCollection;
      this.dotList.forEach( val => {
        val.visible = true
      });
    });
  }

  getAllTeams() {
    this.headList = [];
    this.teamService.getAllDistinctTeams().subscribe(async resp => {
      this.teamList = resp.teams;
      for(let t of this.teamList) {
          await this.teamService.getEmployeeByCode(t.EmployeeCode).toPromise().then( (respt) => {
            this.headList.push(respt.employee);
          });
      }
      await this.manageService.getActiveSchedule().toPromise().then(res => {
        let schemaColl = res.schedules;
        for(let team of this.teamList) {
          team.scheduled = schemaColl.some(f => { return f.TeamId == team.id });
        }
      });
      for(let head of this.headList) {
        head.teamId = this.teamList.find(f => { return f.EmployeeCode == head.code }).id;
        head.scheduled = this.teamList.find(f => { return f.EmployeeCode == head.code }).scheduled;
      }
      this.refreshTeams();
    });
  }

  registerCompleted(teamid: number) {
    this.manageService.clearSchedule(teamid).subscribe(
      (resp: any) => {
        if(resp.code == 200) {
          Swal.fire('Complteado', resp.message, 'success');
          this.clearValuesRoute();
          this.getAllStore();
          this.getAllTeams();
        }
        if(resp.code == 400) {
          Swal.fire('Oops...', resp.message, 'error');
        }
      },
      (error) => {
        if(error.code == 403) {
          Swal.fire('Oops...', 'Aun hay tareas por revisar', 'error');
        }
      }
    );
  }

  getSectorParents() {
    this.sectors = [];
    this.selectedSector = 0;
    this.selectedDot = {} as StoreI;
    this.sectorsService.getParents().subscribe( async (res) => {
      this.parents = res.parents;
    });
  }

  getSectorsByParent() {   
    this.sectors = [];
    this.selectedSector = 0;
    this.selectedDot = {} as StoreI;
    if(this.selectedParent > 0) {
      this.sectorsService.getSectorsByParent(this.selectedParent).subscribe(res => {
        this.sectors = res.sectors;
        this.dotList.forEach( val => {
          if(this.assignStoreColl.length > 0) {
            if(this.assignStoreColl.some( f => { return f.id == val.id })) {
              val.visible = false;
            } else {
              val.visible = (val.department == this.selectedParent) ? true : false;
            }
          } else {
            val.visible = (val.department == this.selectedParent) ? true : false;
          }
        });
      });
    } else {
      this.dotList.forEach( val => { val.visible = true });
    }
  }
  
  getFileredDots() {
    if(this.selectedSector > 0) {
      this.dotList.forEach( val => {
        if(this.assignStoreColl.length > 0) {
          if(this.assignStoreColl.some(f => { return f.id == val.id })) {
            val.visible = false;
          } else {
            val.visible = (val.sector == this.selectedSector) ? true : false;
          }
        }
        val.visible = (val.sector == this.selectedSector) ? true : false;
      });
    } else {
      this.selectedSector = 0;
      this.getSectorsByParent();
    }
  }

  asignarPuntos() {
    this.selectDots = !this.selectDots;
    if(!this.selectDots) {
      this.buttonString = "Seleccionar puntos";
      this.assignStoreColl = [];
      if(this.selectedSector > 0) {
        this.getFileredDots();
      } else if(this.selectedParent > 0) {
        this.getSectorsByParent();
      } else {
        this.dotList.forEach( d => {
          d.visible = true;
        });
      }
      this.waypointsSelect = false;
      this.initDot = {};
      this.lastDot = {};
      this.waypointsCalculate = [];
      this.assignStoreColl = [];
      this.distanceKM = 0;
    } else {
      this.buttonString = "Cancelar";
    }
  }

  filterTeamByDate() {
    //let datetime = new Date(this.date.year, this.date.month - 1, this.date.day).getTime();
    this.headList = [];
    this.teamService.filterTeamByDate().subscribe( (resp) => {
      this.teamList = resp.teams;
      this.teamList.forEach( t => {
        this.teamService.getEmployeeByCode(t.head).subscribe( (respt) => {
          this.headList.push(respt.employee);
          this.refreshTeams();
        });
      });
    });
  }

  returnToDotCollection(code: number) {
    this.assignStoreColl = this.assignStoreColl.filter(f => {
      return f.id != code;
    });
    if(this.selectedSector > 0) {
      this.getFileredDots();
    } else if(this.selectedParent > 0) {
      this.getSectorsByParent();
    } else {
      this.dotList.find( f => { return f.id == code }).visible = true;
    }
  }

  checkDistance() {
    //13.644347 LAT -89.1383239 LONG
    this.initDot = { lat: 13.644347, lng: -89.1383239 };
    this.lastDot = { lat: 13.644347, lng: -89.1383239 };
    this.dotList.forEach(dl => {
      dl.visible = false;
    });
    this.waypointsCalculate = [];
    if(this.assignStoreColl.length >= 1) {
      for(let i = 0; i <= this.assignStoreColl.length - 1; i++) {
        this.waypointsCalculate.push({ 
          location: { 
            lat: parseFloat(this.assignStoreColl[i].latitude), 
            lng: parseFloat(this.assignStoreColl[i].longitude ) } 
        });
        /*if(i == 0) {
          this.initDot = { lat: parseFloat(this.assignStoreColl[i].latitude), lng: parseFloat(this.assignStoreColl[i].longitude) };
        } else if(i == (this.assignStoreColl.length -1) ) {
          this.lastDot = { lat: parseFloat(this.assignStoreColl[i].latitude), lng: parseFloat(this.assignStoreColl[i].longitude) };
        }*/
      }
      this.waypointsSelect = true;
    } else {
      this.waypointsSelect = false;
      Swal.fire('Error', "Muy pocos puntos para calcular ruta", 'error');
    }
  }

  requestResponse(event) {
    let distanceArray = event.routes[0].legs;
    let meters = 0;
    for(let i = 0; i <= distanceArray.length - 1; i++) {
      meters += distanceArray[i].distance.value;
    }
    this.distanceKM = parseFloat((meters / 1000).toFixed(2));
  }

  clearValuesRoute() {
    this.selectDots = false;
    this.selectedParent = 0;
    this.selectedSector = 0;
    this.waypointsSelect = false;
    this.initDot = {};
    this.lastDot = {};
    this.waypointsCalculate = [];
    this.assignStoreColl = [];
    this.distanceKM = 0;
    this.buttonString = "Seleccionar puntos";
  }

  registrarSchedule(code: number) {
    if(this.assignStoreColl.length > 0) {
      if(this.distanceKM > 0) {
        //let datetime = new Date(this.date.year, this.date.month - 1, this.date.day).getTime();
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        let dateTime = new Date(year, month, day).getTime();
        let tmpInterface = {
          route: this.assignStoreColl,
          TeamId: code,
          routeDistance: this.distanceKM,
          date: dateTime
        }
        this.manageService.createSchema(tmpInterface).subscribe(resp => {
          if(resp.code == 200) {
            console.log("Registro de tarea creado exitosamente");
            this.clearValuesRoute();
            this.getAllStore();
            this.getAllTeams();
          }
        });
      } else {
        Swal.fire('Oops...', "No ha calculado la ruta", 'error');
      }
    } else {
      Swal.fire('Oops...', "No ha seleccionado una ruta para el equipo", 'error');
    }
  }

  async cerrarSesion() {
    await this.cacheService.deleteToken().toPromise().then(() => {});
    localStorage.removeItem('ACCESS_TOKEN');
    this.router.navigate(['/auth']);
  }

  onMouseOver(infoWindow, $event: MouseEvent, evnt) {
    this.tmpHoverInfo = this.dotList.find( (x) => { return x.latitude == evnt.coords.lat && x.longitude == evnt.coords.lng } );
    infoWindow.open();
  }

  onMouseOut(infoWindow, $event: MouseEvent) {
    this.tmpHoverInfo = {};
    infoWindow.close();
  }
}
