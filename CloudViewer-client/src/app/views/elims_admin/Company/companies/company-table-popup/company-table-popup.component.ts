import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

// interface SelectItem {
//     label: string;
//     value: any;
// }

@Component({
  selector: 'app-company-table-popup',
  templateUrl: './company-table-popup.component.html',
  // styleUrls: ['./asset-table-popup.component.scss']
})
export class CompanyTablePopupComponent implements OnInit {
  public itemForm: FormGroup;
  public StateDataList: String[];
  public StatusDataList: any[];
  public WellSiteDataList: any[];

  myForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CompanyTablePopupComponent>,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.fb = new FormBuilder();
    this.buildItemForm(this.data)
  }

  buildItemForm(DataIn: any) {
    this.myForm = this.fb.group({
      CompanyName: [DataIn.CompanyName, Validators.required],
      epCustomerID: [DataIn.epCustomerID, Validators.required],
      custRecDelivery: [DataIn.custRecDelivery],
    });

  }

  submit() {
    this.dialogRef.close({...this.data, ...this.myForm.value})
  }

}