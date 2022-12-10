import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

import { AngularFireDatabase } from 'angularfire2/database';


@Injectable({
  providedIn: 'root'
})
export class SensorService {

  payload: any

  constructor(
    public db: AngularFireDatabase,
  ) {
    this.db.object('smartFarm').valueChanges().subscribe(resp => {
      this.payload = resp
      console.log(this.payload)
    })
  }

  getAll() {
    return this.db.object('smartFarm').valueChanges()
  }
}