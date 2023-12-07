import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PrintJRComponent } from '../PrintDialog/print-jr/print-jr.component';

@Injectable({
  providedIn: 'root'
})
export class PrintJRService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    tableHeading:string,
    btnOkText: string = 'Print',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm'|'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(PrintJRComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.tableHeading=tableHeading,
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    return modalRef.result;
  }
}
