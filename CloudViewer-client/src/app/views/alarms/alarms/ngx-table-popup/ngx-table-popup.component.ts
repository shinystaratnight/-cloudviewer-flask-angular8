import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup.component.html',
  //entryComponents: [PopupComponent],
})
export class PopupComponent implements OnInit {
  public itemForm: FormGroup;

  itemPluralMapping = {
    'Alarm': {
      '=1': 'Low',
      '=2': 'Medium',
      '=3': 'High',
    },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupComponent>,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }

  buildItemForm(item) {

    this.itemForm = this.fb.group({
      alarmName: [item.alarmName || '', Validators.required],
      alarmDeviceAndSensor: [item.alarmDeviceAndSensor || ''],
      alarmType: [item.alarmType || ''],
      alarmText: [item.alarmText || ''],
      alarmSetpoint: [item.alarmSetpoint || '', Validators.required],
      alarmLevel: [item.alarmLevel || ''],
    })
  }

  submit() {

    const merged: Object = { ...this.data.payload, ...this.itemForm.value };
    this.dialogRef.close(merged)
  }
}
