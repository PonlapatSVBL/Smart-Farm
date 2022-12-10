import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public SystemName: string = "MF1";
  firstCopy = false;

  // data
  public lineChartData: Array<number> = [1, 8, 49];

  public labelMFL: Array<any> = [
    {
      data: this.lineChartData,
      label: this.SystemName
    }
  ];
  // labels
  public lineChartLabels: Array<any> = ["2018-01-29 10:00:00", "2018-01-29 10:27:00", "2018-01-29 10:28:00"];

  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          max: 60,
          min: 0,
        }
      }],
      xAxes: [{


      }],
    },
    plugins: {
      datalabels: {
        display: true,
        align: 'top',
        anchor: 'end',
        //color: "#2756B3",
        color: "#222",

        font: {
          family: 'FontAwesome',
          size: 14
        },

      },
      deferred: false

    },

  };

  _lineChartColors: Array<any> = [{
    backgroundColor: 'red',
    borderColor: 'red',
    pointBackgroundColor: 'red',
    pointBorderColor: 'red',
    pointHoverBackgroundColor: 'red',
    pointHoverBorderColor: 'red'
  }];



  public ChartType = 'line';

  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }


  nodes = [
    {
      title: 'ว่านหางจระเข้',
      key: '0',
      isLeaf: true,
    },
    {
      title: 'หน้าวัว',
      key: '1',
      isLeaf: true,
    },
    {
      title: 'อะโวคาโด',
      key: '2',
      isLeaf: true,
    },
    {
      title: 'โหระพา',
      key: '3',
      isLeaf: true,
    },
    {
      title: 'แบล็กเบอร์รี่',
      key: '4',
      isLeaf: true,
    },
    {
      title: 'บลูเบอร์รี่',
      key: '5',
      isLeaf: true,
    },
    {
      title: 'บรอกโคลี',
      key: '6',
      isLeaf: true,
    },
    {
      title: 'วงศ์สับปะรด',
      key: '7',
      isLeaf: true,
    },
    {
      title: 'คล้า',
      key: '8',
      isLeaf: true,
    },
    {
      title: 'กัญชา (ระยะออกดอก)',
      key: '9',
      isLeaf: true,
    },
    {
      title: 'กัญชา (ระยะเพาะเมล็ด)',
      key: '10',
      isLeaf: true,
    },
    {
      title: 'กัญชา (ระยะการเจริญเติบโตทางลำต้นและใบ)',
      key: '11',
      isLeaf: true,
    },
    {
      title: 'เบญจมาศ',
      key: '12',
      isLeaf: true,
    },
    {
      title: 'ผักชี',
      key: '13',
      isLeaf: true,
    },
    {
      title: 'สกุลเปล้า',
      key: '14',
      isLeaf: true,
    },
    {
      title: 'แตงกวา',
      key: '15',
      isLeaf: true,
    },
    {
      title: 'พืชสวนครัว (ขนาดเล็ก)',
      key: '16',
      isLeaf: true,
    },
    {
      title: 'กระบองเพชรทะเลทราย',
      key: '17',
      isLeaf: true,
    },
    {
      title: 'ผักชีลาว',
      key: '18',
      isLeaf: true,
    },
    {
      title: 'ผักกาดหอม',
      key: '19',
      isLeaf: true,
    },
    {
      title: 'พริก',
      key: '20',
      isLeaf: true,
    },
    {
      title: 'มะเขือเทศ',
      key: '21',
      isLeaf: true
    }
  ];

  timeStart
  timeStop
  valueTimer = 30

  constructor() { }

  ngOnInit(): void {

  }

}
