import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SensorService } from '../services/sensor.service';

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

  timeStart
  timeStop
  valueTimer = 30
  presetSelect
  presetNameSelect

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
    },
    {
      title: 'หน้าวัว',
      key: 1,
      isLeaf: true,
    },
    {
      title: 'อะโวคาโด',
      key: 2,
      isLeaf: true,
    },
    {
      title: 'โหระพา',
      key: 3,
      isLeaf: true,
    },
    {
      title: 'แบล็กเบอร์รี่',
      key: 4,
      isLeaf: true,
    },
    {
      title: 'บลูเบอร์รี่',
      key: 5,
      isLeaf: true,
    },
    {
      title: 'บรอกโคลี',
      key: 6,
      isLeaf: true,
    },
    {
      title: 'วงศ์สับปะรด',
      key: 7,
      isLeaf: true,
    },
    {
      title: 'คล้า',
      key: 8,
      isLeaf: true,
    },
    {
      title: 'กัญชา (ระยะออกดอก)',
      key: 9,
      isLeaf: true,
    },
    {
      title: 'กัญชา (ระยะเพาะเมล็ด)',
      key: 10,
      isLeaf: true,
    },
    {
      title: 'กัญชา (ระยะการเจริญเติบโตทางลำต้นและใบ)',
      key: 11,
      isLeaf: true,
    },
    {
      title: 'เบญจมาศ',
      key: 12,
      isLeaf: true,
    },
    {
      title: 'ผักชี',
      key: 13,
      isLeaf: true,
    },
    {
      title: 'สกุลเปล้า',
      key: 14,
      isLeaf: true,
    },
    {
      title: 'แตงกวา',
      key: 15,
      isLeaf: true,
    },
    {
      title: 'พืชสวนครัว (ขนาดเล็ก)',
      key: 16,
      isLeaf: true,
    },
    {
      title: 'กระบองเพชรทะเลทราย',
      key: 17,
      isLeaf: true,
    },
    {
      title: 'ผักชีลาว',
      key: 18,
      isLeaf: true,
    },
    {
      title: 'ผักกาดหอม',
      key: 19,
      isLeaf: true,
    },
    {
      title: 'พริก',
      key: 20,
      isLeaf: true,
    },
    {
      title: 'มะเขือเทศ',
      key: 21,
      isLeaf: true
    }
  ];

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

      this.presetSelect = this.data.preset
      this.changePreset(this.presetSelect)

    })
  }

  changePreset(event) {
    this.nodes.find(p => {
      if (p.key === event) {
        this.presetNameSelect = p.title
      }
    })
  }

  setTimerDelay(e) {
    this._sensorService.setTimerDelay(e)
  }

  setPreset(e) {
    this._sensorService.setPreset(e)
    this._sensorService.setPPFD(e*20)
  }

  chartClicked(e: any): void {
    /* console.log(e); */
  }

  chartHovered(e: any): void {
    /* console.log(e); */
  }

}
