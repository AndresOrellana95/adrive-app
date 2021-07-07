import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageService } from '../../../services/manage.services';
import { Options, ImageResult } from "ngx-image2dataurl";
import { CacheService } from '../../../services/cache.service';

@Component({
  selector: 'app-checkjob',
  templateUrl: './checkjob.component.html',
  styleUrls: ['./checkjob.component.css']
})
export class CheckjobComponent implements OnInit {
  jobId: number;
  job = {} as any;
  selectedImg: any;
  selectedDot = {} as any;
  accetptedImage = [] as any;
  beforeImage = [] as any;
  afterImage = [] as any;
  areaWP = [] as any;
  structureP = [] as any;

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private manageService: ManageService,
    private cacheService: CacheService) { }

  ngOnInit(): void {
    this.route.params.subscribe( p => {
      this.jobId = p.jobid;
      this.manageService.getJobDetails(this.jobId).subscribe(
        (res) => {
          if(res.code == 200) {
            this.job = res.job;
            this.selectedDot = res.job.Store;
            this.accetptedImage.push(this.job.accepted);
            this.beforeImage.push(this.job.before1);
            if(this.job.before2) {
              this.beforeImage.push(this.job.before2);
            }
            if(this.job.before3) {
              this.beforeImage.push(this.job.before3);
            }
            this.afterImage.push(this.job.after1);
            if(this.job.after2) {
              this.afterImage.push(this.job.after2);
            }
            if(this.job.after3) {
              this.afterImage.push(this.job.after3);
            }
            this.areaWP = this.job.structureWP;
            this.structureP = this.job.structureP;
          }
        },
        (error) => {
          console.log(error.message);
        }
      );
    });
  }

  checkImage(i: number, c: number) {
    if(c === 1) {
      this.selectedImg = this.beforeImage[i];
    } else if(c === 2) {
      this.selectedImg = this.afterImage[i];
    } else {
      this.selectedImg = this.accetptedImage[i];
    }
  }

  approve() {
    let data = {
      id: this.job.id,
      storeid: this.selectedDot.id
    }
    this.manageService.approveJob(data).subscribe(
      (res) => {
        if(res.code == 200) {
          console.log("Operación realizada con éxito");
          this.router.navigate(['/manage/stock']);
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  assign() {
    let data = {
      id: this.job.id,
      storeid: this.selectedDot.id
    }
    this.manageService.reescheduleJob(data).subscribe(
      (res) => {
        if(res.code == 200) {
          console.log("Operación realizada con éxito");
          this.router.navigate(['/manage/stock']);
        }
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  cerrarSesion() {
    localStorage.removeItem('ACCESS_TOKEN');
    this.router.navigate(['/auth']);
  }

}
