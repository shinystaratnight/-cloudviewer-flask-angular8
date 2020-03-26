import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ElimsAdminService } from '../../../elims_admin.service';

// interface SelectItem {
//     label: string;
//     value: any;
// }

@Component({
  selector: 'app-districts-table-popup',
  templateUrl: './districts-table-popup.component.html',
})
export class DistrictsTablePopupComponent implements OnInit {
  public itemForm: FormGroup;
  public CompanyList: any[] = Array();

  myForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DistrictsTablePopupComponent>,
    private fb: FormBuilder,
    private elimsAdminService: ElimsAdminService,
  ) {


  }

  ngOnInit() {
    this.CompanyList = this.data.CompanyList;
    this.fb = new FormBuilder();
    this.buildItemForm(this.data)
  }

  buildItemForm(DataIn: any) {
    this.myForm = this.fb.group({
      Company: [DataIn.customerID],
      DistrictName: [DataIn.district, Validators.required],
      Comment: [DataIn.comment, Validators.required],
    });

  }

  submit() {
    this.dialogRef.close({...this.data, ...this.myForm.value})
  }

}