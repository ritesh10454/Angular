import { Component, OnInit,Input, ViewChild, ElementRef, AfterViewInit, Renderer2  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-print-jr',
  templateUrl: './print-jr.component.html',
  styleUrls: ['./print-jr.component.css']
})
export class PrintJRComponent implements AfterViewInit {
  @Input() title: string="";
  @Input() tableHeading:string="";
  @Input() btnOkText: string="";
  @Input() btnCancelText: string="";
  constructor(private activeModal: NgbActiveModal){}
  ngAfterViewInit(): void {
  
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
}
