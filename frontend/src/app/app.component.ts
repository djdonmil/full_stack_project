import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  transactiondata: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getTransactionList('')

  }

  public error: any = '';

  getTransactionList(search_address: any) {
    this.api.getAll(search_address ?.target ?.value).subscribe((res: any) => {
      this.transactiondata = res.data;
      this.error = ''
    }, error => { // second parameter is to listen for error
      if (error.error.statusCode == 404) {
        this.transactiondata = []
      }
      this.error = error.error.message;
    });
  }

  download() {
    let newArr: any = []

    var doc = new jsPDF()

    //fetching out keys for table
    const colKeys = Object.keys(this.transactiondata[0])

    //pushing data for table body
    this.transactiondata.forEach((e: any) => {
      newArr.push([
        e.Txhash,
        e.DateTime,
        e.Address,
        e.Amount

      ])
    });

    autoTable(doc, {
      head: [colKeys],
      body: newArr,
      columnStyles: {
        1: { cellWidth: 30 },
      }
    })


    doc.save('transactions.pdf')
  }


}
