import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SensorService } from '../services/sensor.service';
import * as moment from 'moment';
import { AngularFireAuth } from 'angularfire2/auth';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

//import * as auth from 'firebase/auth';
//import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  date;
  data;

  shutterDegree = 0
  ledPower = 0
  temperature = 0
  humidity = 0
  soilMoisture1 = 0
  soilMoisture2 = 0
  lastestTime

  ppfd1st
  ppfd2nd
  dli1st
  dli2nd

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
  presetDLISelect

  formatPercent = (percent: number) => `${percent}%`;
  formatDegree = (percent: number) => `${(percent * 90 / 100).toFixed(2)}°`;
  formatCelsius = (percent: number) => `${percent}°c`;

  //conversion_factor = 0.00508
  conversion_factor = 0.0051
  conversion_factor_sun = 0.0029

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
  ChartLabels_logs: Label[] = [];

  ChartData_PPFD: ChartDataSets[] = [
    {
      data: [],
      label: 'PPFD ชั้นบน'
    },
    {
      data: [],
      label: 'PPFD ชั้นล่าง'
    },
  ];
  ChartData_DLI: ChartDataSets[] = [
    {
      data: [],
      label: 'DLI ชั้นบน'
    },
    {
      data: [],
      label: 'DLI ชั้นล่าง'
    },
  ];
  ChartData_ledPower: ChartDataSets[] = [
    {
      data: [],
      label: 'LED Power'
    },
  ];
  ChartData_shutterDegree: ChartDataSets[] = [
    {
      data: [],
      label: 'Shutter Degree'
    },
  ];
  ChartData_humidity: ChartDataSets[] = [
    {
      data: [],
      label: 'Humidity'
    },
  ];
  ChartData_temperature: ChartDataSets[] = [
    {
      data: [],
      label: 'Temperature'
    },
  ];
  ChartData_soilMoisture1: ChartDataSets[] = [
    {
      data: [],
      label: 'Soil moisture ชั้นบน'
    },
  ];
  ChartData_soilMoisture2: ChartDataSets[] = [
    {
      data: [],
      label: 'Soil moisture ชั้นล่าง'
    },
  ];

  ChartOptions_PPFD: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          max: 2000,
          min: 0,
        }
      }],
      xAxes: [{}],
    },
  };
  ChartOptions_DLI: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          max: 30,
          min: 0,
        }
      }],
      xAxes: [{}],
    },
  };
  ChartOptions_percent: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          max: 120,
          min: 0,
        }
      }],
      xAxes: [{}],
    },
  };
  ChartOptions_soilmoisture: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          max: 200,
          min: 0,
        }
      }],
      xAxes: [{}],
    },
  };

  ChartColorsPPFD_DLI: Color[] = [
    {
      backgroundColor: '#e0f8f8',
      borderColor: '#4bc0c0',
      pointBackgroundColor: '#01b4b4',
      pointBorderColor: '#01b4b4',
      pointHoverBackgroundColor: '#1a6363',
      pointHoverBorderColor: '#1a6363'
    },
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
  mode_selected = '01'
  mode_list = [
    {
      key: '01',
      title: 'Real time',
    },
    {
      key: '02',
      title: 'Logs',
    },
  ]

  nodes = [
    /* {
      title: 'ว่านหางจระเข้',
      key: 0,
      isLeaf: true,
      ppfd: 120,
      dli: 14,
    }, */
    /* {
      title: 'หน้าวัว',
      key: 1,
      isLeaf: true,
      ppfd: 240,
    }, */
    /* {
      title: 'อะโวคาโด',
      key: 2,
      isLeaf: true,
      ppfd: 525,
    }, */
    {
      title: 'โหระพา',
      key: 3,
      isLeaf: true,
      ppfd: 360,
      dli: 26,
    },
    /* {
      title: 'แบล็กเบอร์รี่',
      key: 4,
      isLeaf: true,
      ppfd: 250,
    }, */
    /* {
      title: 'บลูเบอร์รี่',
      key: 5,
      isLeaf: true,
      ppfd: 550,
    }, */
    /* {
      title: 'บรอกโคลี',
      key: 6,
      isLeaf: true,
      ppfd: 500,
      dli: 35,
    }, */
    /* {
      title: 'วงศ์สับปะรด',
      key: 7,
      isLeaf: true,
      ppfd: 340,
    }, */
    /* {
      title: 'คล้า',
      key: 8,
      isLeaf: true,
      ppfd: 240,
    }, */
    {
      title: 'กัญชา (ระยะออกดอก)',
      key: 9,
      isLeaf: true,
      ppfd: 775,
      dli: 40,
    },
    {
      title: 'กัญชา (ระยะเพาะเมล็ด)',
      key: 10,
      isLeaf: true,
      ppfd: 200,
      dli: 16,
    },
    {
      title: 'กัญชา (ระยะการเจริญเติบโตทางลำต้นและใบ)',
      key: 11,
      isLeaf: true,
      ppfd: 425,
      dli: 24,
    },
    /* {
      title: 'เบญจมาศ',
      key: 12,
      isLeaf: true,
      ppfd: 250,
    }, */
    {
      title: 'ผักชี',
      key: 13,
      isLeaf: true,
      ppfd: 450,
      dli: 16,
    },
    /* {
      title: 'สกุลเปล้า',
      key: 14,
      isLeaf: true,
      ppfd: 120,
    }, */
    /* {
      title: 'แตงกวา',
      key: 15,
      isLeaf: true,
      ppfd: 450,
    }, */
    {
      title: 'พืชสวนครัว (ขนาดเล็ก)',
      key: 16,
      isLeaf: true,
      ppfd: 200,
      dli: 12,
    },
    /* {
      title: 'กระบองเพชรทะเลทราย',
      key: 17,
      isLeaf: true,
      ppfd: 1250,
      dli: 30,
    }, */
    {
      title: 'ผักชีลาว',
      key: 18,
      isLeaf: true,
      ppfd: 450,
      dli: 28,
    },
    {
      title: 'ผักกาดหอม',
      key: 19,
      isLeaf: true,
      ppfd: 300,
      dli: 16,
    },
    {
      title: 'พริก',
      key: 20,
      isLeaf: true,
      ppfd: 450,
      dli: 30,
    },
    /* {
      title: 'มะเขือเทศ',
      key: 21,
      isLeaf: true,
      ppfd: 575,
    } */
  ]

  constructor(
    private _sensorService: SensorService,
    public afAuth: AngularFireAuth,
  ) {
    this.Login('admin@gmail.com', '123456')
  }

  Login(email: string, password: string) {
    //this.afAuth.auth.signInAnonymously()

    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(res => {
      console.log(res)
    })

  }

  ngOnInit(): void {
    //this.date = moment(new Date()).format('YYYY-MM-DD').toString()
    this.initialData()
  }

  initialData() {
    /* this._sensorService.getDataLog(this.data).subscribe(resp => {
      let arr = Object.keys(resp).reduce((acc, key) => {
        acc.push(resp[key])
        return acc
      }, [])
      console.log(arr)

    }) */

    this._sensorService.getAll().subscribe(resp => {
      console.log(resp)
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
      this.temperature = this.data.temperature === 0? 35.6 : this.data.temperature
      this.humidity = this.data.humidity === 0? 72.3 :  this.data.humidity
      /* this.soilMoisture1 = this.mapValue(this.data.soil_moisture.f1, 83, 24, 0, 100)
      this.soilMoisture2 = this.mapValue(this.data.soil_moisture.f2, 90, 24, 0, 100) */
      this.soilMoisture1 = this.mapValue(this.data.soil_moisture.f1, 60, 0, 0, 100)
      this.soilMoisture2 = this.mapValue(this.data.soil_moisture.f2, 60, 0, 0, 100)
      this.ChartData1st[0].data = value1st
      this.ChartData2nd[0].data = value2nd
      this.ppfd1st = (value1st.reduce((acc, val) => acc + val, 0) * this.conversion_factor_sun).toFixed(1)
      this.ppfd2nd = (value2nd.reduce((acc, val) => acc + val, 0) * this.conversion_factor).toFixed(1)
      this.dli1st = (this.data.dli / 1000000).toFixed(1)
      this.dli2nd = (this.data.dli2 / 1000000).toFixed(1)
      this.lastestTime = this.data.lastestTime

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

    this.getDateList()
  }

  date_list = []
  getDateList() {
    this._sensorService.getDate().subscribe(resp => {
      this.date_list = Object.keys(resp)
      console.log(this.date_list)
    })
  }

  mapValue(value, fromLow, fromHigh, toLow, toHigh): number {
    value = value > fromLow ? fromLow : value
    value = value < fromHigh ? fromHigh : value
    return Math.floor((value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow)
  }

  changePreset(event) {
    this.nodes.find(p => {
      if (p.key === event) {
        this.presetNameSelect = p.title
        this.presetPPFDSelect = p.ppfd
        this.presetDLISelect = p.dli
      }
    })
  }

  changeDate(event) {
    this.date = event
    console.log(this.date)

    this.getLogs(event)
  }

  //logData_list
  getLogs(date?) {
    date = date ? date : moment(new Date()).format('YYYY-MM-DD').toString()

    this.ppfd_list = []
    this.ppfd2_list = []
    this.dli_list = []
    this.dli2_list = []
    this.ledPower_list = []
    this.shutterDegree_list = []
    this.humidity_list = []
    this.temperature_list = []
    this.soilMoisture1_list = []
    this.soilMoisture2_list = []
    this.timestamp_list = []

    this._sensorService.getDataLog(date).then(resp => {
      console.log(resp.toJSON())

      let as7262_1st = {
        v: [],
        b: [],
        g: [],
        y: [],
        o: [],
        r: [],
      }
      let as7263_1st = {
        r: [],
        s: [],
        t: [],
        u: [],
        v: [],
        w: [],
      }
      let as7262_2nd = {
        v: [],
        b: [],
        g: [],
        y: [],
        o: [],
        r: [],
      }
      let as7263_2nd = {
        r: [],
        s: [],
        t: [],
        u: [],
        v: [],
        w: [],
      }
      let ppfd_1st = []
      let ppfd_2nd = []
      let dli_1st = []
      let dli_2nd = []
      let timestamp = []
      let arr = Object.keys(resp.toJSON()).reduce((acc, key) => {

        as7262_1st['v'].push(resp.toJSON()[key]['as7262-f1']['v'])
        as7262_1st['b'].push(resp.toJSON()[key]['as7262-f1']['b'])
        as7262_1st['g'].push(resp.toJSON()[key]['as7262-f1']['g'])
        as7262_1st['y'].push(resp.toJSON()[key]['as7262-f1']['y'])
        as7262_1st['o'].push(resp.toJSON()[key]['as7262-f1']['o'])
        as7262_1st['r'].push(resp.toJSON()[key]['as7262-f1']['r'])

        as7262_2nd['v'].push(resp.toJSON()[key]['as7262-f2']['v'])
        as7262_2nd['b'].push(resp.toJSON()[key]['as7262-f2']['b'])
        as7262_2nd['g'].push(resp.toJSON()[key]['as7262-f2']['g'])
        as7262_2nd['y'].push(resp.toJSON()[key]['as7262-f2']['y'])
        as7262_2nd['o'].push(resp.toJSON()[key]['as7262-f2']['o'])
        as7262_2nd['r'].push(resp.toJSON()[key]['as7262-f2']['r'])

        as7263_1st['r'].push(resp.toJSON()[key]['as7263-f1']['r'])
        as7263_1st['s'].push(resp.toJSON()[key]['as7263-f1']['s'])
        as7263_1st['t'].push(resp.toJSON()[key]['as7263-f1']['t'])
        as7263_1st['u'].push(resp.toJSON()[key]['as7263-f1']['u'])
        as7263_1st['v'].push(resp.toJSON()[key]['as7263-f1']['v'])
        as7263_1st['w'].push(resp.toJSON()[key]['as7263-f1']['w'])

        as7263_2nd['r'].push(resp.toJSON()[key]['as7263-f2']['r'])
        as7263_2nd['s'].push(resp.toJSON()[key]['as7263-f2']['s'])
        as7263_2nd['t'].push(resp.toJSON()[key]['as7263-f2']['t'])
        as7263_2nd['u'].push(resp.toJSON()[key]['as7263-f2']['u'])
        as7263_2nd['v'].push(resp.toJSON()[key]['as7263-f2']['v'])
        as7263_2nd['w'].push(resp.toJSON()[key]['as7263-f2']['w'])

        ppfd_1st.push((
          resp.toJSON()[key]['as7262-f1']['v'] + resp.toJSON()[key]['as7262-f1']['b'] + resp.toJSON()[key]['as7262-f1']['g'] +
          resp.toJSON()[key]['as7262-f1']['y'] + resp.toJSON()[key]['as7262-f1']['o'] + resp.toJSON()[key]['as7262-f1']['r'] +
          resp.toJSON()[key]['as7263-f1']['r'] + resp.toJSON()[key]['as7263-f1']['s'] + resp.toJSON()[key]['as7263-f1']['t'] +
          resp.toJSON()[key]['as7263-f1']['u'] + resp.toJSON()[key]['as7263-f1']['v'] + resp.toJSON()[key]['as7263-f1']['w']
        ) * this.conversion_factor)
        ppfd_2nd.push((
          resp.toJSON()[key]['as7262-f2']['v'] + resp.toJSON()[key]['as7262-f2']['b'] + resp.toJSON()[key]['as7262-f2']['g'] +
          resp.toJSON()[key]['as7262-f2']['y'] + resp.toJSON()[key]['as7262-f2']['o'] + resp.toJSON()[key]['as7262-f2']['r'] +
          resp.toJSON()[key]['as7263-f2']['r'] + resp.toJSON()[key]['as7263-f2']['s'] + resp.toJSON()[key]['as7263-f2']['t'] +
          resp.toJSON()[key]['as7263-f2']['u'] + resp.toJSON()[key]['as7263-f2']['v'] + resp.toJSON()[key]['as7263-f2']['w']
        ) * this.conversion_factor)
        dli_1st.push(resp.toJSON()[key]['dli'])
        dli_2nd.push(resp.toJSON()[key]['dli2'])
        timestamp.push(resp.toJSON()[key]['timestamp'])

        acc.push(resp.toJSON()[key])
        return acc
      }, [])
      
      console.log(arr)
      this.createChartData(arr)

      /* console.log('as7262_1st', as7262_1st)
      console.log('as7263_1st', as7263_1st)
      console.log('as7262_2nd', as7262_2nd)
      console.log('as7263_2nd', as7263_2nd)
      console.log('timestamp', timestamp) */

      /* Prepare data to excel */
      let FileName = `data-${date}.xlsx`
      let dataSensor: any = []
      for(let i=0; i<timestamp.length; i++) {
        let node = {
          timestamp: timestamp[i],

          as7262_1st_v: as7262_1st['v'][i],
          as7262_1st_b: as7262_1st['b'][i],
          as7262_1st_g: as7262_1st['g'][i],
          as7262_1st_y: as7262_1st['y'][i],
          as7262_1st_o: as7262_1st['o'][i],
          as7262_1st_r: as7262_1st['r'][i],

          as7263_1st_r: as7263_1st['r'][i],
          as7263_1st_s: as7263_1st['s'][i],
          as7263_1st_t: as7263_1st['t'][i],
          as7263_1st_u: as7263_1st['u'][i],
          as7263_1st_v: as7263_1st['v'][i],
          as7263_1st_w: as7263_1st['w'][i],

          as7262_2nd_v: as7262_2nd['v'][i],
          as7262_2nd_b: as7262_2nd['b'][i],
          as7262_2nd_g: as7262_2nd['g'][i],
          as7262_2nd_y: as7262_2nd['y'][i],
          as7262_2nd_o: as7262_2nd['o'][i],
          as7262_2nd_r: as7262_2nd['r'][i],

          as7263_2nd_r: as7263_2nd['r'][i],
          as7263_2nd_s: as7263_2nd['s'][i],
          as7263_2nd_t: as7263_2nd['t'][i],
          as7263_2nd_u: as7263_2nd['u'][i],
          as7263_2nd_v: as7263_2nd['v'][i],
          as7263_2nd_w: as7263_2nd['w'][i],

          ppfd_1st: ppfd_1st[i],
          ppfd_2nd: ppfd_2nd[i],
          dli_1st: dli_1st[i],
          dli_2nd: dli_2nd[i],
        }

        dataSensor.push(node)
      }
      this.exportExcel(dataSensor, FileName)

    })
  }

  exportExcel(dataSensor: any[], FileName: string): void {
    console.log(dataSensor)

    /* From ChatGPT */

    const worksheet = XLSX.utils.json_to_sheet(dataSensor);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, FileName);

    /* -- From ChatGPT -- */

    /* const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataSensor);
    const workbook: XLSX.WorkBook = {
      Sheets: { Sheet1: worksheet },
      SheetNames: ['AS7262+AS7263'],
    }

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xls',
      type: 'array',
    })

    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    const date = new Date();
    const filename = 'AS726x.xls';

    FileSaver.saveAs(data, filename); */

    /* var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(dataSensor);
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `data.xlsx`); */
  }

  ppfd_list
  ppfd2_list
  dli_list
  dli2_list
  ledPower_list
  shutterDegree_list
  humidity_list
  temperature_list
  soilMoisture1_list
  soilMoisture2_list
  timestamp_list
  createChartData(log_list: any[]) {
    log_list.forEach(item => {
      let calPPFD = this.conversion_factor * (
        item['as7262-f1']['v'] + item['as7262-f1']['b'] + item['as7262-f1']['g'] + item['as7262-f1']['y'] + item['as7262-f1']['o'] + item['as7262-f1']['r'] +
        item['as7263-f1']['r'] + item['as7263-f1']['s'] + item['as7263-f1']['t'] + item['as7263-f1']['u'] + item['as7263-f1']['v'] + item['as7263-f1']['w']
      )
      let calPPFD2 = this.conversion_factor * (
        item['as7262-f2']['v'] + item['as7262-f2']['b'] + item['as7262-f2']['g'] + item['as7262-f2']['y'] + item['as7262-f2']['o'] + item['as7262-f2']['r'] +
        item['as7263-f2']['r'] + item['as7263-f2']['s'] + item['as7263-f2']['t'] + item['as7263-f2']['u'] + item['as7263-f2']['v'] + item['as7263-f2']['w']
      )
      this.ppfd_list.push(calPPFD)
      this.ppfd2_list.push(calPPFD2)

      this.dli_list.push(item.dli / 1000000)
      this.dli2_list.push(item.dli2 / 1000000)
      this.ledPower_list.push(item.ledPower)
      this.shutterDegree_list.push(item.shutterDegree)

      this.humidity_list.push(item.humidity)
      this.temperature_list.push(item.temperature)
      this.soilMoisture1_list.push(item['soil-moisture-f1'])
      this.soilMoisture2_list.push(item['soil-moisture-f2'])
      this.timestamp_list.push(item.timestamp)
    })

    this.ChartLabels_logs = this.timestamp_list
    this.ChartData_PPFD[0].data = this.ppfd_list
    this.ChartData_PPFD[1].data = this.ppfd2_list
    this.ChartData_DLI[0].data = this.dli_list
    this.ChartData_DLI[1].data = this.dli2_list
    this.ChartData_ledPower[0].data = this.ledPower_list
    this.ChartData_shutterDegree[0].data = this.shutterDegree_list
    this.ChartData_humidity[0].data = this.humidity_list
    this.ChartData_temperature[0].data = this.temperature_list
    this.ChartData_soilMoisture1[0].data = this.soilMoisture1_list
    this.ChartData_soilMoisture2[0].data = this.soilMoisture2_list

    /* console.log(this.ppfd_list)
    console.log(this.dli_list)
    console.log(this.ledPower_list)
    console.log(this.shutterDegree_list)
    console.log(this.humidity_list)
    console.log(this.temperature_list)
    console.log(this.soilMoisture1_list)
    console.log(this.soilMoisture2_list)
    console.log(this.timestamp_list) */
  }

  moistureAlert(value) {
    if (value >= 0 && value <= 39) {
      return `น้อยเกิน ควรรดน้ำ`
    }
    else if (value >= 40 && value <= 49) {
      return `น้อย`
    }
    else if (value >= 50 && value <= 69) {
      return `เหมาะสม`
    }
    else if (value >= 70 && value <= 79) {
      return `มาก`
    }
    else if (value >= 80 && value <= 100) {
      return `มากเกิน ไม่ต้องรดน้ำ`
    }
  }

  moistureLevelColor(value) {
    if (value >= 0 && value <= 39) {
      return `red`
    }
    else if (value >= 40 && value <= 49) {
      return `orange`
    }
    else if (value >= 50 && value <= 69) {
      return `green`
    }
    else if (value >= 70 && value <= 79) {
      return `orange`
    }
    else if (value >= 80 && value <= 100) {
      return `red`
    }
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
    this._sensorService.setDLI(pres.dli)
  }

  chartClicked(e: any): void {
    /* console.log(e); */
  }

  chartHovered(e: any): void {
    /* console.log(e); */
  }

}
