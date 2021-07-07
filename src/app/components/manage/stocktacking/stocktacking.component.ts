import { Component, OnInit } from '@angular/core';
import { ManageService } from '../../../services/manage.services';
import { TeamService } from '../../../services/teams.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CacheService } from '../../../services/cache.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-stocktacking',
  templateUrl: './stocktacking.component.html',
  styleUrls: ['./stocktacking.component.css']
})
export class StocktackingComponent implements OnInit {
  active = 1;
  subActive = 1;
  productForm: FormGroup;
  ratioForm: FormGroup;
  scheduleList = [] as any;
  headList = [] as any;
  teamList = [] as any;
  totalList = [] as any;
  totalListT = [] as any;
  keywordEmp = "name";
  teamSelected = {} as any;
  head = {} as any;
  team = {} as any;
  canSave = false;
  page = 1;
  pageSize = 25;
  translator = [];
  totalUsed = {} as any;
  jobList = [] as any;
  jobListT = [] as any;
  pageJ = 1;
  pageSizeJ = 10;
  dateFilter = {} as any;

  constructor(private teamService: TeamService, 
    private manageService: ManageService,
    private router: Router,
    private cacheService: CacheService) { 
      this.productForm = new FormGroup({
        picture1: new FormControl(false),
        picture2: new FormControl(false),
        picture3: new FormControl(false),
        picture4: new FormControl(false),
        picture5: new FormControl(false),
        picture6: new FormControl(false),
        alambGalv: new FormControl(0),
        bandejaRod: new FormControl(0),
        bidones: new FormControl(0),
        brocaConc316: new FormControl(0),
        brocaCon38: new FormControl(0),
        brocaCon516: new FormControl(0),
        brocha05: new FormControl(0),
        brocha1: new FormControl(0),
        brocha112: new FormControl(0),
        brocha2: new FormControl(0),
        brocha4: new FormControl(0),
        brocha6: new FormControl(0),
        cajaHerrRoja: new FormControl(0),
        cepAlambre: new FormControl(0),
        cinchaPlast14: new FormControl(0),
        cintaMetrica: new FormControl(0),
        destPhilips: new FormControl(0),
        destPhilipsPlano: new FormControl(0),
        escaleraExt: new FormControl(0),
        escaleraTjr: new FormControl(0),
        escobas: new FormControl(0),
        espatulas: new FormControl(0),
        extElectrica: new FormControl(0),
        extRodillo: new FormControl(0),
        felpas9Plisa: new FormControl(0),
        felpas9Or: new FormControl(0),
        nylon: new FormControl(0),
        manRodillo9: new FormControl(0),
        martillo: new FormControl(0),
        nivelCaja: new FormControl(0),
        pinzas: new FormControl(0),
        pPhilipsTal: new FormControl(0),
        pPlanaTal: new FormControl(0),
        taladro: new FormControl(0),
        cintDobCara: new FormControl(0),
        clavoAcr1: new FormControl(0),
        torBr1Hex: new FormControl(0),
        aclaP38: new FormControl(0),
        wype: new FormControl(0),
        cubo8Tal: new FormControl(0),
        solventeMin: new FormControl(0),
        itemPrv1: new FormControl(0),
        itemPrv2: new FormControl(0),
        itemPrv3: new FormControl(0),
        itemPrv4: new FormControl(0),
        itemPrv5: new FormControl(0),
        itemPrv6: new FormControl(0),
        itemPrv7: new FormControl(0),
        itemPrv8: new FormControl(0),
        itemPrv9: new FormControl(0),
        itemPrv10: new FormControl(0),
        blancaLtx: new FormControl(0),
        blancaBrill: new FormControl(0),
        blancaOpt: new FormControl(0),
        amrBrill: new FormControl(0),
        azulBrill: new FormControl(0),
        blancaAntic: new FormControl(0),
        blancaTopCover: new FormControl(0),
        prinPrv1: new FormControl(0),
        prinPrv2: new FormControl(0),
        prinPrv3: new FormControl(0),
        prinPrv4: new FormControl(0),
        prinPrv5: new FormControl(0)
      });
      this.ratioForm = new FormGroup({
        blancaLtx: new FormControl(0),
        blancaOpt: new FormControl(0),
        amrBrill: new FormControl(0),
        azulBrill: new FormControl(0)
      });
  }

  manageMap() {
    this.router.navigate(['/manage/map']);
  }

  manageTeam() {
    this.router.navigate(['/teams/control']);
  }

  ngOnInit(): void {
    this.manageService.getActiveSchedule().subscribe( resp => {
      this.scheduleList = resp.schedules;
      this.scheduleList.forEach( sl => {
        this.headList.push(sl.head);
        this.teamList.push(sl.Team);
      });
    });
    this.translator = this.manageService.jsonProductParse;
  }

  refreshTotals() {
    this.totalListT = this.totalList
      .map((total, i) => ({ident: i + 1, ...total}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  refreshJobs() {
    this.jobListT = this.jobList
      .map((job, i) => ({ident: i + 1, ...job}))
      .slice((this.pageJ - 1) * this.pageSizeJ, (this.pageJ - 1) * this.pageSizeJ + this.pageSizeJ);
  }

  headSelected(evt): void {
    this.team = this.teamList.find( tl => { return tl.EmployeeCode == evt.code });
    this.getHistoryProducts();
    this.getRatioValues();
  }

  getRatioValues():void {
    this.manageService.getLastRatios(this.team.id).subscribe(
      resp => {
        if(resp.code == 200) {
          if(resp.ratios.length > 0) {
            this.ratioForm.setValue({
              blancaLtx: resp.ratios[0].blancaLtx,
              blancaOpt: resp.ratios[0].blancaOpt,
              amrBrill: resp.ratios[0].amrBrill,
              azulBrill: resp.ratios[0].azulBrill
            });
          } else {
            this.ratioForm.setValue({
              blancaLtx: 0,
              blancaOpt: 0,
              amrBrill: 0,
              azulBrill: 0
            });
          }
        }
      }
    );
  }

  getHistoryProducts() {
    this.manageService.getTeamHistoryProducts(this.team.id).subscribe(resp => {
      this.teamSelected = resp.team;
      this.totalUsed = this.teamSelected.totalUsed;
      this.totalList = this.teamSelected.totals;
      this.head = this.teamSelected.head;
      this.canSave = true;
      this.totalList.forEach(element => {
        let used = this.totalUsed[element.key] || 0;
        element.esp = element.value - used;
        element.key = this.translator.find( f => { return f.value == element.key } ).key;
      });
      this.refreshTotals();
    });
  }

  insertStockTacking() {
    if(this.teamSelected.id > 0) {
      this.manageService.assignProducts(this.teamSelected.id, this.productForm.value).subscribe( 
        (resp) => {
          if(resp.code != 200) {
            Swal.fire('Oops...', 'Error al asignar razones al equipo', 'error');
          } else {
            Swal.fire('Operación realizada', 'Productos agregados', 'success');
            this.getHistoryProducts();
          }
        },
        (error) => {
          console.log("Error al asignar productos");
        }
      );
    }
  }

  insertRatio() {
    if(this.teamSelected.id > 0) {
      console.log(this.ratioForm.value);
      this.manageService.setRatioTeam(this.ratioForm.value, this.teamSelected.id).subscribe(
        (resp) => {
          if(resp.code == 200) {
            Swal.fire('Operación realizada', 'Razones actualizadas', 'success');
          } else {
            Swal.fire('Oops...', 'Error al asignar razones al equipo', 'error');
          }
        },
        (error) => {
          console.log("Error al asignar razones al equipo");
        }
      );
    }
  }
  
  getAllJobs() {
    this.manageService.getAllJobs().subscribe(
      (resp) => {
        if(resp.code == 200) {
          this.jobList = resp.jobList;
          this.refreshJobs();
        }
      },
      (error) => {
        console.log("Error el consultar tareas");
      }
    );
  }

  filterByDate() {
    let datetime = new Date(this.dateFilter.year, this.dateFilter.month - 1, this.dateFilter.day).getTime();
    this.manageService.getAllJobsByDate(datetime.toString()).subscribe(
      (res) => {
        if(res.code == 200) {
          this.jobList = res.jobList;
          this.refreshJobs();
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  goToDetail(id: number) {
    this.router.navigate(['/manage/checkjob', { jobid: id }]);
  }

  async cerrarSesion() {
    await this.cacheService.deleteToken().toPromise().then(() => {});
    localStorage.removeItem('ACCESS_TOKEN');
    this.router.navigate(['/auth']);
  }
}
