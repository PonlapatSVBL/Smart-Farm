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

  setDay(value: any) {
    return this.db.object('smartFarm/day').update({
      mon: value.mon,
      tue: value.tue,
      wed: value.wed,
      thu: value.thu,
      fri: value.fri,
      sat: value.sat,
      sun: value.sun,
    }).catch(err => console.log(err))
  }

  setTimeStart(value: string, h?: number, m?: number) {
    return this.db.object('smartFarm/time').update({start: value}).then(resp => {
      this.db.object('smartFarm/time').update({startHour: h}).catch(err => console.log(err))
      this.db.object('smartFarm/time').update({startMin: m}).catch(err => console.log(err))
    })
  }

  setTimeStop(value: string, h?: number, m?: number) {
    return this.db.object('smartFarm/time').update({stop: value}).then(resp => {
      this.db.object('smartFarm/time').update({stopHour: h}).catch(err => console.log(err))
      this.db.object('smartFarm/time').update({stopMin: m}).catch(err => console.log(err))
    })
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