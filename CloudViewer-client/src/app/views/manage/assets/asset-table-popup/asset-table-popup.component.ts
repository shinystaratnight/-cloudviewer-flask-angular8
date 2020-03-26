import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { IsNumberDirective } from '@shared/validators/is-number.directive';

// interface SelectItem {
//     label: string;
//     value: any;
// }

@Component({
  selector: 'app-asset-table-popup',
  templateUrl: './asset-table-popup.component.html',
  styleUrls: ['./asset-table-popup.component.scss']
})
export class AssetTablePopupComponent implements OnInit {
  public itemForm: FormGroup;
  public StateDataList: String[];
  public StatusDataList: any[];
  public WellSiteDataList: any[];

  myForm: FormGroup;
  State: FormControl;
  Status: FormControl;
  WellSites: FormControl;
  AssetName: FormControl;
  Chemical: FormControl;

  private fb: FormBuilder;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssetTablePopupComponent>,
  ) {
  }

  ngOnInit() {
    this.fb = new FormBuilder();
    this.buildItemForm(this.data)
  }

  buildItemForm(DataIn) {


    this.StateDataList = DataIn.StateDataList;
    this.StatusDataList = DataIn.StatusDataList;
    this.WellSiteDataList = DataIn.WellSiteDataList;

    this.AssetName = this.fb.control({ value: DataIn.AssetName, disabled: false }, Validators.required);
    this.WellSites = this.fb.control({ value: DataIn.WellSite_Current, disabled: false }, Validators.required);
    this.State = this.fb.control({ value: DataIn.State_Current, disabled: false }, [Validators.required]);
    this.Status = this.fb.control({ value: DataIn.Status_Current, disabled: false }, Validators.required);
    this.WellSites = this.fb.control({ value: DataIn.WellSite_Current, disabled: false });
    this.Chemical = this.fb.control({ value: DataIn.Chemical_Current, disabled: false });

    this.itemForm = new FormGroup({
      AssetName: this.AssetName,
      State: this.State,
      Status: this.Status,
      WellSites: this.WellSites,
      Chemical: this.Chemical
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
