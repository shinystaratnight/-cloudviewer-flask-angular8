import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

// interface SelectItem {
//     label: string;
//     value: any;
// }

@Component({
  selector: 'app-asset-table-popup',
  templateUrl: './asset-table-popup.component.html',
  styleUrls: ['./asset-table-popup.component.scss']
})
export class AssetTablePopupComponent2 implements OnInit {
  public itemForm: FormGroup;
  public StateDataList: String[];
  public StatusDataList: any[];
  public WellSiteDataList: any[];

  myForm: FormGroup;
  State: FormControl;
  Status: FormControl;
  WellSites: FormControl;
  private fb: FormBuilder;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssetTablePopupComponent2>,
  ) {

  }

  ngOnInit() {
    this.fb = new FormBuilder();
    this.buildItemForm(this.data)
  }

  ngAfterViewInit() {

  }

  buildItemForm(DataIn) {
    this.StateDataList = DataIn.StateDataList;
    this.StatusDataList = DataIn.StatusDataList;
    this.WellSiteDataList = DataIn.WellSiteDataList;
    //this.itemForm = this.fb.group();

    this.State = this.fb.control({ value: DataIn.State_Current, disabled: false }, [Validators.required]),
      this.Status = this.fb.control({ value: DataIn.Status_Current, disabled: false }, Validators.required),
      this.WellSites = this.fb.control({ value: DataIn.WellSite_Current, disabled: false }),
      this.itemForm = new FormGroup({
        State: this.State,
        Status: this.Status,
        WellSites: this.WellSites,
      });

  }

  // compareFn_SelectItem(v1: any, v2: any): boolean {
  //
  //   return compareFn(v1, v2);
  // }

  submit() {
    this.dialogRef.close(this.itemForm.value)
  }

}

// function compareFn(v1: any, v2: any): boolean {
//
//   return v1 && v2 ? v1.value === v2.value : v1 === v2;
// }
