import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SensorService } from '../services/sensor.service';
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  data;

  ledPower = 0
  shutterDegree = 0

  ppfd1st
  ppfd2nd

  dayCheck = {
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
    sun: false,
  }
  timeStart
  timeStop
  valueTimer = 30
  presetSelect
  presetNameSelect
  presetPPFDSelect

  formatPercent = (percent: number) => `${percent}%`;
  formatDegree = (percent: number) => `${percent}°`;

  conversion_factor = 0.00508

  /* -------------------------------------------------------------------------------------- */
  ChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          max: 70000,
          min: 0,
        }
      }],
      xAxes: [{}],
    },
  };
  ChartLabels: Label[] = ['450nm', '500nm', '550nm', '570nm', '600nm', '610nm', '650nm', '680nm', '730nm', '760nm', '810nm', '860nm'];
  ChartType: ChartType = 'line';
  ChartLegend = true;
  ChartData1st: ChartDataSets[] = [
    {
      data: [],
      label: 'Sensor ชั้นบน'
    },
  ];
  ChartColors1st: Color[] = [
    {
      backgroundColor: '#e0f8f8',
      borderColor: '#4bc0c0',
      pointBackgroundColor: '#01b4b4',
      pointBorderColor: '#01b4b4',
      pointHoverBackgroundColor: '#1a6363',
      pointHoverBorderColor: '#1a6363'
    },
  ]

  ChartData2nd: ChartDataSets[] = [
    {
      data: [],
      label: 'Sensor ชั้นล่าง'
    },
  ];
  ChartColors2nd: Color[] = [
    {
      backgroundColor: '#d7ecfb',
      borderColor: '#36a2eb',
      pointBackgroundColor: '#0d87d8',
      pointBorderColor: '#0d87d8',
      pointHoverBackgroundColor: '#0066aa',
      pointHoverBorderColor: '#0066aa'
    },
  ]

  /* -------------------------------------------------------------------------------------- */
  nodes = [
    {
      title: 'ว่านหางจระเข้',
      key: 0,
      isLeaf: true,
      ppfd: 120,
    },
    {
      title: 'หน้าวัว',
      key: 1,
      isLeaf: true,
      ppfd: 240,
    },
    {
      title: 'อะโวคาโด',
      key: 2,
      isLeaf: true,
      ppfd: 525,
    },
    {
      title: 'โหระพา',
      key: 3,
      isLeaf: true,
      ppfd: 360,
    },
    {
      title: 'แบล็กเบอร์รี่',
      key: 4,
      isLeaf: true,
      ppfd: 250,
    },
    {
      title: 'บลูเบอร์รี่',
      key: 5,
      isLeaf: true,
      ppfd: 550,
    },
    {
      title: 'บรอกโคลี',
      key: 6,
      isLeaf: true,
      ppfd: 500,
    },
    {
      title: 'วงศ์สับปะรด',
      key: 7,
      isLeaf: true,
      ppfd: 340,
    },
    {
      title: 'คล้า',
      key: 8,
      isLeaf: true,
      ppfd: 240,
    },
    {
      title: 'กัญชา (ระยะออกดอก)',
      key: 9,
      isLeaf: true,
      ppfd: 775,
    },
    {
      title: 'กัญชา (ระยะเพาะเมล็ด)',
      key: 10,
      isLeaf: true,
      ppfd: 200,
    },
    {
      title: 'กัญชา (ระยะการเจริญเติบโตทางลำต้นและใบ)',
      key: 11,
      isLeaf: true,
      ppfd: 425,
    },
    {
      title: 'เบญจมาศ',
      key: 12,
      isLeaf: true,
      ppfd: 250,
    },
    {
      title: 'ผักชี',
      key: 13,
      isLeaf: true,
      ppfd: 450,
    },
    {
      title: 'สกุลเปล้า',
      key: 14,
      isLeaf: true,
      ppfd: 120,
    },
    {
      title: 'แตงกวา',
      key: 15,
      isLeaf: true,
      ppfd: 450,
    },
    {
      title: 'พืชสวนครัว (ขนาดเล็ก)',
      key: 16,
      isLeaf: true,
      ppfd: 200,
    },
    {
      title: 'กระบองเพชรทะเลทราย',
      key: 17,
      isLeaf: true,
      ppfd: 1250,
    },
    {
      title: 'ผักชีลาว',
      key: 18,
      isLeaf: true,
      ppfd: 450,
    },
    {
      title: 'ผักกาดหอม',
      key: 19,
      isLeaf: true,
      ppfd: 300,
    },
    {
      title: 'พริก',
      key: 20,
      isLeaf: true,
      ppfd: 450,
    },
    {
      title: 'มะเขือเทศ',
      key: 21,
      isLeaf: true,
      ppfd: 575,
    }
  ]

  constructor(
    private _sensorService: SensorService,
  ) { }

  ngOnInit(): void {
    this.initialData()
  }

  initialData() {
    this._sensorService.getAll().subscribe(resp => {
      /* console.log(resp) */
      this.data = resp

      let value1st = [
        this.data.sensor1stFloor.as7262.v,
        this.data.sensor1stFloor.as7262.b,
        this.data.sensor1stFloor.as7262.g,
        this.data.sensor1stFloor.as7262.y,
        this.data.sensor1stFloor.as7262.o,
        this.data.sensor1stFloor.as7262.r,
        this.data.sensor1stFloor.as7263.r,
        this.data.sensor1stFloor.as7263.s,
        this.data.sensor1stFloor.as7263.t,
        this.data.sensor1stFloor.as7263.u,
        this.data.sensor1stFloor.as7263.v,
        this.data.sensor1stFloor.as7263.w,
      ]
      let value2nd = [
        this.data.sensor2ndFloor.as7262.v,
        this.data.sensor2ndFloor.as7262.b,
        this.data.sensor2ndFloor.as7262.g,
        this.data.sensor2ndFloor.as7262.y,
        this.data.sensor2ndFloor.as7262.o,
        this.data.sensor2ndFloor.as7262.r,
        this.data.sensor2ndFloor.as7263.r,
        this.data.sensor2ndFloor.as7263.s,
        this.data.sensor2ndFloor.as7263.t,
        this.data.sensor2ndFloor.as7263.u,
        this.data.sensor2ndFloor.as7263.v,
        this.data.sensor2ndFloor.as7263.w,
      ]

      this.ledPower = this.data.ledPower
      this.shutterDegree = this.data.shutterDeg
      this.ChartData1st[0].data = value1st
      this.ChartData2nd[0].data = value2nd
      this.ppfd1st = (value1st.reduce((acc, val) => acc + val, 0) * this.conversion_factor).toFixed(1)
      this.ppfd2nd = (value2nd.reduce((acc, val) => acc + val, 0) * this.conversion_factor).toFixed(1)

      this.dayCheck['mon'] = this.data.day.mon
      this.dayCheck['tue'] = this.data.day.tue
      this.dayCheck['wed'] = this.data.day.wed
      this.dayCheck['thu'] = this.data.day.thu
      this.dayCheck['fri'] = this.data.day.fri
      this.dayCheck['sat'] = this.data.day.sat
      this.dayCheck['sun'] = this.data.day.sun
      this.timeStart = moment(new Date(this.data.time.start))
      this.timeStop = moment(new Date(this.data.time.stop))
      this.valueTimer = this.data.timer
      this.presetSelect = this.data.preset
      this.changePreset(this.presetSelect)

    })
  }

  changePreset(event) {
    this.nodes.find(p => {
      if (p.key === event) {
        this.presetNameSelect = p.title
        this.presetPPFDSelect = p.ppfd
      }
    })
  }

  changeDay() {
    this._sensorService.setDay(this.dayCheck)
  }

  changeTimeStart(event) {
    if (event != null) {
      let date = moment(new Date(event)).toISOString()
      let h: number = Number(moment(new Date(event)).format('HH'))
      let m: number = Number(moment(new Date(event)).format('mm'))
      this._sensorService.setTimeStart(date, h, m)
    }
  }

  changeTimeStop(event) {
    if (event != null) {
      let date = moment(new Date(event)).toISOString()
      let h: number = Number(moment(new Date(event)).format('HH'))
      let m: number = Number(moment(new Date(event)).format('mm'))
      this._sensorService.setTimeStop(date, h, m)
    }
  }

  setTimerDelay(e) {
    this._sensorService.setTimerDelay(e)
  }

  setPreset(e) {
    let pres = this.nodes.find(p => p.key === e)
    this._sensorService.setPreset(pres.key)
    this._sensorService.setPPFD(pres.ppfd)
  }

  chartClicked(e: any): void {
    /* console.log(e); */
  }

  chartHovered(e: any): void {
    /* console.log(e); */
  }

}
