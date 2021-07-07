import { Component, OnInit, ViewChild, TemplateRef, PipeTransform } from '@angular/core';
import * as XLSX from 'xlsx';
import { TeamService } from '../../../services/teams.service';
import { AuthService } from '../../../services/auth.service';
import { CarI } from '../../../interfaces/Car';
import { TeamI } from '../../../interfaces/TeamI';
import { EmployeeI } from "../../../interfaces/EmployeeI";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CacheService } from '../../../services/cache.service';
import { FormControl } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team-control',
  templateUrl: './team-control.component.html',
  styleUrls: ['./team-control.component.css']
})
export class TeamControlComponent implements OnInit {
  active = 1;
  arrayBuffer:any;
  file:File;
  carsList: CarI[] = [];
  employeeList: EmployeeI[] = [];
  carsListT: CarI[] = [];
  employeeListT: EmployeeI[] = [];
  teamList: TeamI[] = [];
  teamListT: TeamI[] = [];
  dataUpload = {} as any;
  arrayBufferP:any;
  fileP:File;
  dataUploadP = {} as any;
  uploadString: string;
  @ViewChild("successLoad") modalRef: TemplateRef<any>;
  @ViewChild("teamCar") autoCompTeamCar;
  @ViewChild("teamHead") autoCompTeamHead;
  @ViewChild("teamMate") autoCompTeamMate;
  page = 1;
  pageSize = 5;
  pageE = 1;
  pageSizeE = 5;
  pageT = 1;
  pageSizeT = 5;
  teamForm;
  model: NgbDateStruct;
  emplees$: Observable<EmployeeI[]>;
  filterEmployee = new FormControl('');
  headEmployee = {} as EmployeeI;
  mateList = [] as EmployeeI[];
  keywordCar="model";
  keywordEmp="name";
  carToSchedule = {} as any;
  headToSchedule = {} as any;
  mateListSchedule = {} as any;
  mateListScheduleArry = [];
  keysFlag = false;
  placeCar = "Seleccione un vehículo";

  constructor(private teamService: TeamService,
    private authService: AuthService,
    private modalService: NgbModal,
    pipe: DecimalPipe,
    private router: Router,
    private cacheService: CacheService) { 
  }

  ngOnInit(): void {
      this.getAllEmployees();
      this.getAllTeams();
      this.getAllCars();
  }

  manageMap() {
    this.router.navigate(['/manage/map']);
  }

  manageStock() {
    this.router.navigate(['/manage/stock']);
  }

  clearTeamEmployees() {
    this.keysFlag = false;
    this.carToSchedule = {};
    this.headEmployee = {} as any;
    this.mateListScheduleArry = [] as any[];
  }

  setHeadTeam(event) {
    this.headToSchedule = event;
  }

  setCarTeam(event) {
    this.carToSchedule = event;
  }

  refreshCars() {
    this.carsListT = this.carsList
      .map((car, i) => ({ident: i + 1, ...car}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  refreshEmployees() {
    this.employeeListT = this.employeeList
      .map((emp, i) => ({ident: i + 1, ...emp}))
      .slice((this.pageE - 1) * this.pageSizeE, (this.pageE - 1) * this.pageSizeE + this.pageSizeE);
  }

  searchEmployee(text: string, pipe: PipeTransform): EmployeeI[] {
    return this.employeeList.filter(empl => {
      const term = text.toLowerCase();
      return empl.name.toLowerCase().includes(term)
          || pipe.transform(empl.code).includes(term);
    });
  }

  refreshTeams() {
    this.teamListT = this.teamList
      .map((team, i) => ({ident: i + 1, ...team}))
      .slice((this.pageT - 1) * this.pageSizeT, (this.pageT - 1) * this.pageSizeT + this.pageSizeT);
  }

  getAllTeams() {
    this.teamService.getAllTeams().subscribe( resp => {
      this.teamList = resp.teams;
      this.refreshTeams();
    });
  }

  getAllCars() {
    this.teamService.getAllCars().subscribe( resp => {
      this.carsList = resp.carsCollection;
      this.refreshCars();
    });
  }

  getAllEmployees() {
    this.teamService.getAllEmployess().subscribe( resp => {
      this.employeeList = resp.employees;
      this.refreshEmployees();
    });
  }

  fileChangeListenerCars(event: any): void {
    {
      this.file= event.target.files[0]; 
    }
  }

  fileChangeListenerPainters(event: any): void {
    {
      this.fileP= event.target.files[0]; 
    }
  }

  carsToDB() {
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
        for (let element of this.dataUpload) {
          let newCar = {} as CarI;
          newCar.code = element.Placa;
          newCar.model = element.Descripcion;
          newCar.inUse = false;
          let value = await this.teamService.createCar(newCar).toPromise().then(
            res => {
              if(res.code != 200) {
                console.log("Error al persistir registro de automovil");
              }
            },
            error => {
              console.log("Error al persistir registro de automoviles");
            }
          );
        }
        this.uploadString = "Registros de vehículos guardados exitosamente";
        if(!this.modalService.hasOpenModals()) {
          this.modalService.open(this.modalRef, { size: 'sm' });
          this.getAllCars();
        }
    }
    fileReader.readAsArrayBuffer(this.file);
  }

  painterToDB() {
    this.dataUploadP = {};
    let fileReaderP = new FileReader();
    fileReaderP.onload = async (e) => {
        this.arrayBufferP = fileReaderP.result;
        var data = new Uint8Array(this.arrayBufferP);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, {type:"binary"});
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        this.dataUploadP = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        for (let element of this.dataUploadP) {
          let newE = {} as EmployeeI;
          newE.code = element.codUsuario;
          newE.name = element.Nombre;
          newE.password = element.Credencial;
          newE.lastAssign = null;
          newE.partner = false;
          let value = await this.teamService.createEmployee(newE).toPromise().then(
            res => {
            if(res.code != 200) {
              console.log("Error el registrar empleado");
            }
           },
           (error) => {
             console.log("Registro con identificador duplicado");
           }
          );
        }
        this.uploadString = "Registros de empleados guardados exitosamente";
        if(!this.modalService.hasOpenModals()) {
          this.modalService.open(this.modalRef, { size: 'sm' });
          this.getAllEmployees();
        }
    }
    fileReaderP.readAsArrayBuffer(this.fileP);
  }

  addMateToList(event) {
    if(this.headToSchedule) {
      if(this.headToSchedule.code == event.code) {
        return false;
      }
    }
    if(!this.mateListScheduleArry.some( f => { return f.code == event.code })) {
      this.mateListScheduleArry.push(event);
    }
  }

  removeMate(code: string) {
    this.mateListScheduleArry = this.mateListScheduleArry.filter(f => {
      return f.code != code;
    });
  }

  onSubmit() {
    let teamInt = {} as TeamI;
    if(this.carToSchedule.code != null && this.headToSchedule.code != null) {
      if(this.mateListScheduleArry.length == 0) {
        this.mateListScheduleArry = [];
      }
      teamInt.CarCode = this.carToSchedule.code;
      teamInt.EmployeeCode = this.headToSchedule.code;
      teamInt.structure = this.mateListScheduleArry;
      teamInt.keys = this.keysFlag;
      this.teamService.createTeam(teamInt).subscribe( resp => {
        if(resp.code == 200) {
          this.clearOptions();
          Swal.fire('Éxito','Equipo creado','success');
          this.getAllTeams();
          this.clearTeamEmployees();
        }
      });
    }
  }

  clearOptions() {
    this.autoCompTeamCar.clear();
    this.autoCompTeamHead.clear();
    this.autoCompTeamMate.clear();
  }

  async cerrarSesion() {
    await this.cacheService.deleteToken().toPromise().then(() => {});
    localStorage.removeItem('ACCESS_TOKEN');
    this.router.navigate(['/auth']);
  }
}
