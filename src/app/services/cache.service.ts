import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor(private storage: StorageMap) { 

  }

  setToken(token) {
    this.storage.set('token', token).subscribe( () => {});
  }

  getToken() {
    return this.storage.get('token');
  }

  deleteToken() {
    return this.storage.delete('token');
  }

  setRatioValues(ratios) {
    this.storage.set('ratios', ratios).subscribe( () => {} );
  }

  getRatioValues() {
    return this.storage.get('ratios');
  }

  setTotalValues(totalAvailable) {
    this.storage.set('totalAvailable', totalAvailable).subscribe(() => {});
  }
  
  getTotalValues() {
    return this.storage.get('totalAvailable');
  }

  setScheduleInfo(schedule) {
    this.storage.set('schedule', schedule).subscribe(() => {});
  }

  getScheduleInfo() {
    return this.storage.get('schedule');
  }

  setJobList(jobList) {
    this.storage.set('jobList', jobList).subscribe( () => {});
  }

  getJobList() {
    return this.storage.get('jobList');
  }

  setBinnacles(binnacles) {
    this.storage.set('binnacles', binnacles).subscribe(() => {});
  }

  getBinnacles() {
    return this.storage.get('binnacles');
  }

  setTimesTampValues(timestamp) {
    this.storage.set('binnacleList', timestamp).subscribe( () => {});
  }

  getTimesTampValues() {
    return this.storage.get('binnacleList');
  }
}
