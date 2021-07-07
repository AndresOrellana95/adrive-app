import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from '../../../services/store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Template } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-save-dots',
  templateUrl: './save-dots.component.html',
  styleUrls: ['./save-dots.component.css']
})
export class SaveDotsComponent implements OnInit {
  arrayBuffer:any;
  file:File;
  dataUpload = {} as any;
  progress = 0;
  auxTotal = 0;
  @ViewChild("successLoad") modalRef: TemplateRef<any>;

  constructor(private storeService: StoreService,
    private progressBarService: NgbProgressbarConfig,
    private modalService: NgbModal) { }

  ngOnInit(): void {
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

  fileChangeListener(event: any): void {
    {
      this.file= event.target.files[0]; 
    }
  }

  convertDMStoCartesian(degrees: string, type: number):string {
    let longIndex = [0,3,3,5,5,(degrees.length - 1), degrees.length];
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

  getRandomInteger(): number {
    return Math.floor(Math.random() * (276 - 15) + 15);
  }

  dataToDB() {
    this.dataUpload = {};
    let fileReader = new FileReader();
      fileReader.onload = (e) => {
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
          this.dataUpload.forEach(async (value) => {
            value.longitude = this.convertDMStoCartesian(value.Longitud.trim(), 0);
            value.latitude = this.convertDMStoCartesian(value.Latitud.trim(), 1);
            value.department = value["ID DPTO"];
            value.sector = value["ID MUN"];
            await this.storeService.saveDots(value).subscribe(res => {
              if(res.code != 200) {
                console.log("Error en el registro: " + this.progress);
              }
            });
          });
      }
      fileReader.readAsArrayBuffer(this.file);
  }

}
