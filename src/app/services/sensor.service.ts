import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor(
    public db: AngularFireDatabase,
  ) {}

  getAll() {
    return this.db.object('smartFarm').valueChanges()
  }

  setTimerDelay(value: number) {
    return this.db.object('smartFarm').update({timer: value}).catch(err => console.log(err))
  }

  setPreset(value: number ) {
    return this.db.object('smartFarm').update({preset: value}).catch(err => console.log(err))
  }

  setPPFD(value: number) {
    return this.db.object('smartFarm').update({ppfd: value}).catch(err => console.log(err))
  }
}