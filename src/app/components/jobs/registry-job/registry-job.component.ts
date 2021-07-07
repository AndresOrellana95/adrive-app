import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageService } from '../../../services/manage.services';
import { Options, ImageResult } from "ngx-image2dataurl";
import { CacheService } from '../../../services/cache.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registry-job',
  templateUrl: './registry-job.component.html',
  styleUrls: ['./registry-job.component.css']
})
export class RegistryJobComponent implements OnInit {
  jobId: number;
  teamId: number;
  job = {} as any;
  ratios = {} as any;
  galDisp = {} as any;
  selectedDot = {} as any;
  imagesBefore = [];
  imagesAfter = [];
  imageAccetp = [];
  FORMATS = ['jpg', 'png', 'jpeg'];
  blancoOptms: number = 0;
  blancoLatex: number = 0;
  amarillo: number = 0;
  azul: number = 0;
  limitRed: number = 28;
  overflowValue: number = 0;
  src: string = null;
  options: Options = {
    resize: {
      maxHeight: 960,
      maxWidth: 640
    },
    allowedExtensions: ['JPG', 'PNG', 'JPEG']
  };
  nameflag: boolean = false;
  rotule1: boolean = false;
  rotule2: boolean = false;
  rotule3: boolean = false;
  rotule4: boolean = false;
  rotule5: boolean = false;
  rotule6: boolean = false;
  comments: string = "";
  totalPainted: string = "";
  structureP: any;
  structureWP: any;
  usedBlancaLtx: number;
  usedBlancaOpt: number;
  usedYellow: number;
  usedBlue: number;
  pArray = [] as any;
  npArray = [] as any;
  totalPaintedArea: number = 0.0;
  totalWPaintArea: number = 0.0;
  selectedImg: string;

  selectedBefore(imageResult: ImageResult) {
    if (imageResult.error) alert(imageResult.error);
    let src = imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL;
    this.imagesBefore.push(src);
  }

  deleteBefore(index: number) {
    this.imagesBefore.splice(index, 1);
  }

  selectedAfter(imageResult: ImageResult) {
    if (imageResult.error) alert(imageResult.error);
    let src = imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL;
    this.imagesAfter.push(src);
  }

  deleteAfter(index: number) {
    this.imagesAfter.splice(index, 1);
  }
 
  selectedAccept(imageResult: ImageResult) {
    if (imageResult.error) alert(imageResult.error);
    let src = imageResult.resized && imageResult.resized.dataURL || imageResult.dataURL;
    this.imageAccetp.push(src);
  }

  deleteAccept(index: number) {
    this.imageAccetp.splice(index, 1);
  }

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private manageService: ManageService,
    private cacheService: CacheService) { }

  ngOnInit(): void {
    this.route.params.subscribe( p => {
      this.jobId = parseInt(p.jobid);
      this.manageService.getJobDetails(this.jobId).subscribe(
        res => {
          if(res.code == 200) {
            this.job = res.job;
            this.selectedDot = res.job.Store;
            this.teamId = res.job.Schedule.TeamId;
            this.manageService.getLastRatios(this.teamId).subscribe(
              res => {
                if(res.code == 200) {
                  if(res.ratios[0]) {
                    this.ratios = res.ratios[0];
                    this.cacheService.setRatioValues(this.ratios);
                    this.checkRatios();
                  } else {
                    Swal.fire('Oops...', 'Sin razon para las pinturas, comuniquese con su supervisor', 'error');
                  }
                }
              }
            );
            this.manageService.getTotalAvailable(this.teamId).subscribe(
              (resp: any) => {
                if(resp.code == 200) {
                  this.galDisp = resp.totalAvailable;
                  this.cacheService.setTotalValues(resp.totalAvailable);
                }
              },
              (error) => {
                this.cacheService.getTotalValues().subscribe(
                  (resp) => {
                    this.galDisp = resp;
                  }
                );
              }
            );
            /*this.cacheService.getTotalValues().subscribe( (totals) => {
              this.galDisp = totals;
              console.log(this.galDisp);
            });*/
          }
        },
        error => {
          this.cacheService.getScheduleInfo().subscribe(
            (respSI: any) => {
              let scheduleRoute = respSI.schedule.route;
              let jobs = respSI.jobs;
              this.job = jobs.find(f => { return f.id == this.jobId });
              this.job.Store = scheduleRoute.find(f => { return f.id == this.job.StoreId });
              this.selectedDot = this.job.Store;
              this.teamId = respSI.teamId;
              this.cacheService.getTotalValues().subscribe( 
                (respTotals) => {
                  this.galDisp = respTotals;
                  this.cacheService.getRatioValues().subscribe(
                    (respR) => {
                      this.ratios = respR;
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  }

  checkRatios() {
    if( !(this.ratios.blancaOpt > 0) || !(this.ratios.azulBrill > 0) || !(this.ratios.amrBrill > 0) || !(this.ratios.blancaLtx > 0)) {
      Swal.fire('Oops...', 'Sin razones en alguna de las pinturas, comuniquese con su supervisor', 'error')
    }
  }

  saveJobState() {
    if(this.imageAccetp.length > 0 && this.imagesAfter.length > 0 && this.imagesBefore.length > 0) {
      //if(this.totalPaintedArea > 0) {
        let customInterface = {
          id: this.jobId,
          before1: this.imagesBefore[0] || "",
          before2: this.imagesBefore[1] || "",
          before3: this.imagesBefore[2] || "",
          after1: this.imagesAfter[0] || "",
          after2: this.imagesAfter[1] || "",
          after3: this.imagesAfter[2] || "",
          accepted: this.imageAccetp[0],
          name: this.nameflag,
          picture1: this.rotule1,
          picture2: this.rotule2,
          picture3: this.rotule3,
          picture4: this.rotule4,
          picture5: this.rotule5,
          picture6: this.rotule6,
          structureP: this.structureP,
          structureWP: this.structureWP,
          painted: parseFloat(this.totalPainted),
          surplus: this.overflowValue,
          remaining: 0.0,
          comments: this.comments,
          arrival: "",
          departure: "",
          active: true,
          completed: false,
          totalBlancaLtx: this.blancoLatex,
          totalBlancaOpt: this.blancoOptms,
          totalAmrBrill: this.azul,
          totalAzulBrill: this.amarillo,
          usedBlancaLtx: this.usedBlancaLtx,
          usedBlancaOpt: this.usedBlancaOpt,
          usedYellow: this.usedYellow,
          usedBlue: this.usedBlue,
        };
        this.manageService.saveJob(customInterface).subscribe(
          (res:any) => {
            if(res.code == 200) {
              Swal.fire('Éxito','Registro guardado','success');
              this.router.navigate(['/jobs/schedule']);
            } else {

            }
          },
          (error) => {
            this.cacheService.getTotalValues().subscribe(
              (respTA: any) => {
                this.cacheService.getJobList().subscribe( 
                  (respJL: any) => {
                    if(!respJL) {
                      respJL = [];
                    }
                    let jobLWV = respJL.filter(f => { return f.id != customInterface.id });
                    jobLWV.push(customInterface);
                    this.cacheService.setJobList(jobLWV);
                    let disponibles = respTA;
                    disponibles.amrBrill = parseFloat( (disponibles.amrBrill - customInterface.usedYellow).toFixed(3) );
                    disponibles.azulBrill = parseFloat( (disponibles.azulBrill - customInterface.usedBlue).toFixed(3) );
                    disponibles.blancaLtx = parseFloat( (disponibles.blancaLtx - customInterface.usedBlancaLtx).toFixed(3) ) ;
                    disponibles.blancaOpt = parseFloat( (disponibles.blancaOpt - customInterface.usedBlancaOpt).toFixed(3) ) ;
                    this.cacheService.setTotalValues(disponibles);
                    this.cacheService.getScheduleInfo().subscribe( 
                      (respSI: any) => {
                        let schedule = respSI;
                        let jobListed = respSI.jobs.filter(f => { return f.id != customInterface.id });
                        schedule.jobs = jobListed;
                        //let route = respSI.schedule.route;
                        //schedule.schedule.route = route.filter(f => { return f.id !== this.selectedDot.id });
                        this.cacheService.setScheduleInfo(schedule);
                        Swal.fire('Éxito','Registro guardado','success');
                        this.router.navigate(['/jobs/schedule']);
                      }
                    );
                  },
                  (error) => {
                    let jl = [];
                    jl.push(customInterface);
                    let disponibles = respTA;
                    disponibles.amrBrill = parseFloat( (disponibles.amrBrill - customInterface.usedYellow).toFixed(3) ) ;
                    disponibles.azulBrill = parseFloat( (disponibles.azulBrill - customInterface.usedBlue).toFixed(3) ) ;
                    disponibles.blancaLtx = parseFloat( (disponibles.blancaLtx - customInterface.usedBlancaLtx).toFixed(3) ) ;
                    disponibles.blancaOpt = parseFloat( (disponibles.blancaOpt - customInterface.usedBlancaOpt).toFixed(3) ) ;
                    this.cacheService.setTotalValues(disponibles);
                    this.cacheService.setJobList(jl);
                    this.cacheService.getScheduleInfo().subscribe(
                      (respSI: any) => {
                        let scheduleInfo = respSI;
                        let jobslisted = scheduleInfo.jobs.filter(f => { return f.id !== customInterface.id});
                        scheduleInfo.jobs = jobslisted;
                        //let route = respSI.schedule.route;
                        //scheduleInfo.schedule.route = route.filter(f => { return f.id !== this.selectedDot.id });
                        this.cacheService.setScheduleInfo(scheduleInfo);
                        Swal.fire('Éxito','Registro guardado','success');
                        this.router.navigate(['/jobs/schedule']);
                      }
                    );
                  }
                );
              }
            );
          }
        );
      //} else {
      //  Swal.fire('Oops...', 'Debe realizar el calculo de áreas', 'error');
      //}
    } else {
      Swal.fire('Oops...', 'Debe ingresar al menos una imagen por sección', 'error');
    }
  }

  addRow() {
    this.npArray.push({ baseNP: 0.0, alturaNP: 0.0 });
  }
  
  addRowP() {
    this.pArray.push({ base: 0.0 , altura: 0.0 });
  }

  selectImage(i: number, c: number) {
    if(c === 1) {
      this.selectedImg = this.imagesBefore[i];
    } else if(c === 2) {
      this.selectedImg = this.imagesAfter[i];
    } else {
      this.selectedImg = this.imageAccetp[i];
    }
  }

  calculateAreaRegionsWP() {
    let areaNp = 0.0;
    let areaP = 0.0;
    if(this.npArray.length > 0) {
      for(let i = 0; i <= this.npArray.length - 1; i++) {
        if(!isNaN(this.npArray[i].baseNP) && !isNaN(this.npArray[i].alturaNP)) {
          areaNp += this.npArray[i].baseNP * this.npArray[i].alturaNP 
        }
      }
    }
    this.totalWPaintArea = parseFloat(areaNp.toFixed(3));
    for(let j = 0; j <= this.pArray.length - 1; j++) {
      if(!isNaN(this.pArray[j].base) && !isNaN(this.pArray[j].altura)) {
        areaP += this.pArray[j].base * this.pArray[j].altura;
      }
    }
    this.totalPaintedArea = parseFloat(areaP.toFixed(3));
    this.calculateAreaRegions(areaP, areaNp);
  }

  calculateAreaRegions(areaP: number, areaNp: number) {
      if(areaP > areaNp) {
        /*this.totalPaintedArea = parseFloat(atp.toFixed(3));
        //((razon* glEnt)-(((h*0.73) * b)%Pint))/razon
        let atnp = this.totalWPaintArea;
        this.blancoOptms = parseFloat((((this.ratios.blancaOpt * this.galDisp.blancaOpt) - ( (( this.alturaP * 0.73) * this.baseP ) * ( atp/ atnp) )   ) / this.ratios.blancaOpt).toFixed(3));
        this.blancoLatex = parseFloat(((( this.ratios.blancaLtx * this.galDisp.blancaLtx ) - (atp - atnp) ) / this.ratios.blancaLtx).toFixed(3));
        this.amarillo = parseFloat((((this.ratios.amrBrill * this.galDisp.amrBrill ) - ( (this.alturaP * 0.2) * this.baseP ))  / this.ratios.amrBrill).toFixed(3));
        this.azul = parseFloat((((this.ratios.azulBrill * this.galDisp.azulBrill ) - ( ( this.alturaP * 0.07) * this.baseP )) / this.ratios.azulBrill).toFixed(3));
        let over = "";
        this.structureP = { base: this.baseP, altura: this.alturaP};
        this.structureWP = this.npArray;
        this.totalPainted = (atp - atnp).toFixed(3);
        this.usedBlancaLtx = parseFloat((this.galDisp.blancaOpt - this.blancoOptms).toFixed(3));
        this.usedBlancaOpt = parseFloat((this.galDisp.blancaLtx - this.blancoLatex).toFixed(3));
        this.usedBlue = parseFloat((this.galDisp.amrBrill - this.amarillo).toFixed(3));
        this.usedYellow = parseFloat((this.galDisp.azulBrill - this.azul).toFixed(3));
        if((atp-atnp) > this.limitRed) {
          over = ((atp - atnp) - this.limitRed).toFixed(3);
          this.overflowValue = parseFloat(over);
        } else {
          this.overflowValue = 0;
        }*/
        let whiteOptmsArray = [];
        let yellowArray = [];
        let blueArray = [];
        let whiteLatex = [];
        for(let i = 0; i <= this.pArray.length - 1; i++) {
          let availableWOpts = parseFloat((((this.ratios.blancaOpt * this.galDisp.blancaOpt) - ( (( this.pArray[i].altura * 0.73) * this.pArray[i].base ) * ( areaP - areaNp / ( areaP )))) / this.ratios.blancaOpt).toFixed(3));
          let availableBlue = parseFloat((((this.ratios.azulBrill * this.galDisp.azulBrill ) - ( ( this.pArray[i].altura * 0.07) * this.pArray[i].base )) / this.ratios.azulBrill).toFixed(3));
          let availableYellow = parseFloat((((this.ratios.amrBrill * this.galDisp.amrBrill ) - ( (this.pArray[i].altura * 0.2) * this.pArray[i].base ))  / this.ratios.amrBrill).toFixed(3));
          whiteOptmsArray.push( parseFloat( (this.galDisp.blancaOpt - availableWOpts).toFixed(3) ) );
          blueArray.push( parseFloat( (this.galDisp.azulBrill - availableBlue).toFixed(3) ) );
          yellowArray.push( parseFloat( (this.galDisp.amrBrill - availableYellow).toFixed(3) ) );
        }
        let availableWLatex = parseFloat(((( this.ratios.blancaLtx * this.galDisp.blancaLtx ) - (areaP - areaNp) ) / this.ratios.blancaLtx).toFixed(3));
        whiteLatex.push( parseFloat( (this.galDisp.blancaLtx - availableWLatex).toFixed(3) ) );
        this.usedBlancaLtx = Math.abs(parseFloat( (whiteLatex.reduce( function(a,b) { return a + b } )).toFixed(3)));
        this.usedBlancaOpt = Math.abs(parseFloat( (whiteOptmsArray.reduce( function(a,b) { return a + b } )).toFixed(3) ) );
        this.usedYellow = Math.abs(parseFloat((yellowArray.reduce( function(a,b) { return a + b } )).toFixed(3)) );
        this.usedBlue = Math.abs(parseFloat((blueArray.reduce( function(a,b) { return a + b } )).toFixed(3)) );
        this.blancoOptms = parseFloat( (this.galDisp.blancaOpt - this.usedBlancaOpt).toFixed(3) );
        this.blancoLatex = parseFloat( (this.galDisp.blancaLtx - this.usedBlancaLtx).toFixed(3) );
        this.amarillo = parseFloat( (this.galDisp.amrBrill - this.usedYellow).toFixed(3) );
        this.azul = parseFloat( (this.galDisp.azulBrill - this.usedBlue).toFixed(3) );
        this.structureP = this.pArray;
        this.structureWP = this.npArray;
        console.log(this.usedBlancaOpt);
        console.log(this.usedBlancaLtx);
        console.log(this.usedYellow);
        console.log(this.usedBlue);
      } else {
        Swal.fire('Oops...', 'El área no pintada no puede ser mayor que la pintada', 'error');
      }
  }

  returnToMain() {
    this.router.navigate(['/jobs/schedule']);
  }

}
