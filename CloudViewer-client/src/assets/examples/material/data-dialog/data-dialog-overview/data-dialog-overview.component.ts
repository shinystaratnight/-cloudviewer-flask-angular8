import { DialogData } from '../../basic-dialog/basic-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-data-dialog-overview',
  templateUrl: './data-dialog-overview.component.html',
  styleUrls: ['./data-dialog-overview.component.scss']
})
export class DataDialogOverviewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
  }

}
