import { NgModule, Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ElimsAdminService } from '../elims_admin.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { egretAnimations } from '@shared/animations/egret-animations';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {
  FlexibleDialogComponent,
  FlexibleDialogElement,
  FlexibleDialogElement_NVP,
  FlexibleDialogData,
  FlexibleDialogElement_NVP_ObjtoArr,
  FlexibleDialogElement_Type,
  FlexibleDialogStructure,
  FlexibleDialog_ChangeType
} from '@shared/flexible-dialog/flexible-dialog.component';


export enum decodeState {
  'Standby' = 1,
  'Picking up chemical' = 2,
  'Going to wellsite' = 3,
  'At well site' = 4,
}

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
  animations: egretAnimations,
})
export class AssetsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;

  myForm: FormGroup;
  public items: any[];

  public items_filtered: any[];

  public getItemSub: Subscription;
  public getWellsSub: Subscription;
  public MyText: String;
  public WellSiteList: any[];

  // Dialog
  private DialogStructure: FlexibleDialogStructure;
  private DialogElements: FlexibleDialogElement[];
  private DialogData: FlexibleDialogData[];
  public Customers: FlexibleDialogElement_NVP[];

  constructor(
    private FlexDialog: MatDialog,
    private snack: MatSnackBar,
    private elimsAdminService: ElimsAdminService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private cdr: ChangeDetectorRef,
    private Router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {


    this.myForm = this.fb.group({
      filterText: [''],
    });
  }

  SetupDialog() {
    //
    //
    // Setup Dialog

    const StateDataList = Array();
    StateDataList.push(new FlexibleDialogElement_NVP('', ''));
    StateDataList.push(new FlexibleDialogElement_NVP('Standby', 1));
    StateDataList.push(new FlexibleDialogElement_NVP('Picking up chemical', 2));
    StateDataList.push(new FlexibleDialogElement_NVP('Going to wellsite', 3));
    StateDataList.push(new FlexibleDialogElement_NVP('At well site', 4));

    const StatusDataList = Array();
    StatusDataList.push(new FlexibleDialogElement_NVP('', ''));
    StatusDataList.push(new FlexibleDialogElement_NVP('Moving', 'Moving'));
    StatusDataList.push(new FlexibleDialogElement_NVP('Stand Still', 'Stand Still'));

    const AssetTypeList = Array();
    AssetTypeList.push(new FlexibleDialogElement_NVP('', ''));
    AssetTypeList.push(new FlexibleDialogElement_NVP('otr', 'otr'));
    AssetTypeList.push(new FlexibleDialogElement_NVP('facility', 'facility'));

    this.DialogElements = new Array();
    let DialogElement: FlexibleDialogElement;

    DialogElement = new FlexibleDialogElement()
    DialogElement.Type = FlexibleDialogElement_Type.dropdown;
    DialogElement.FormName = 'assetType';
    DialogElement.DisplayName = 'Asset Type';
    DialogElement.Options = AssetTypeList;
    this.DialogElements.push(DialogElement);

    DialogElement = new FlexibleDialogElement()
    DialogElement.Type = FlexibleDialogElement_Type.textbox;
    DialogElement.FormName = 'terminalSN';
    DialogElement.DisplayName = 'Sat Terminal';
    this.DialogElements.push(DialogElement);

    DialogElement = new FlexibleDialogElement()
    DialogElement.Type = FlexibleDialogElement_Type.textbox;
    DialogElement.FormName = 'satSN';
    DialogElement.DisplayName = 'Sat Serial';
    this.DialogElements.push(DialogElement);

    DialogElement = new FlexibleDialogElement()
    DialogElement.Type = FlexibleDialogElement_Type.IPAddress;
    DialogElement.FormName = 'ip';
    DialogElement.DisplayName = 'IP Address';
    this.DialogElements.push(DialogElement);

    DialogElement = new FlexibleDialogElement()
    DialogElement.Type = FlexibleDialogElement_Type.textbox;
    DialogElement.FormName = 'name';
    DialogElement.DisplayName = 'Name';
    this.DialogElements.push(DialogElement);

    DialogElement = new FlexibleDialogElement()
    DialogElement.Type = FlexibleDialogElement_Type.dropdown;
    DialogElement.FormName = 'leasedCustID';
    DialogElement.DisplayName = 'Assigned Customer';
    DialogElement.Options = this.Customers;
    this.DialogElements.push(DialogElement);

    DialogElement = new FlexibleDialogElement()
    DialogElement.Type = FlexibleDialogElement_Type.dropdown;
    DialogElement.FormName = 'state';
    DialogElement.DisplayName = 'State';
    DialogElement.Options = StateDataList;
    this.DialogElements.push(DialogElement);

    DialogElement = new FlexibleDialogElement()
    DialogElement.Type = FlexibleDialogElement_Type.dropdown;
    DialogElement.FormName = 'status';
    DialogElement.DisplayName = 'Status';
    DialogElement.Options = StatusDataList;
    this.DialogElements.push(DialogElement);

    DialogElement = new FlexibleDialogElement()
    DialogElement.Type = FlexibleDialogElement_Type.textbox;
    DialogElement.FormName = 'chemical';
    DialogElement.DisplayName = 'Chemical Name';
    this.DialogElements.push(DialogElement);

  }

  ngOnInit() {
    this.Load();
  }

  Load() {
    const values = forkJoin(
      this.getItems(),
      this.elimsAdminService.getCustomers_api(),
    );

    values.subscribe(
      data => {
        const arrItems = data['0'];
        const Items = arrItems as any[];

        this.Customers = new Array();
        Object.entries(data['1']['customers']).forEach(entry => {
          const NVP = new FlexibleDialogElement_NVP(entry[1]['name'], entry[1]['id'] as string);
          this.Customers.push(NVP);
        });

        Items.forEach((val, num, arr) => {
          arr[num]['stateText'] = decodeState[val['state']];
          const cust = this.Customers.filter(cust => cust.Value === val['leasedCustID'])
          if (cust.length) {
            arr[num]['Customer'] = cust[0].Name;
          }
        });

        this.SetupDialog();
        // Now set the data table
        this.items = Items;
        this.updateFilter(false); // in case there is an active filter
        this.progressBar.mode = 'determinate';
        this.cdr.markForCheck();

      }
    );
  }

  ngAfterViewInit() {
    this.progressBar.mode = 'indeterminate';
  }

  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
    if (this.getWellsSub) {
      this.getWellsSub.unsubscribe();
    }
  }

  updateFilter(event) {

    // copy Items list to filered list.....into a new, unreferenced array
    this.items_filtered = this.items.slice();

    // no filter text
    let items_filter = this.myForm.controls['filterText'].value;
    if (items_filter == '') return true;

    items_filter = items_filter.toLowerCase();

    let columns = Object.keys(this.items_filtered[0]);

    // Removes last "$$index" from "column"
    columns.splice(columns.length - 1);

    // if nothing, return
    if (!columns.length) return;

    this.items_filtered = this.items_filtered.filter(function (row) {
      for (let i = 0; i <= columns.length; i++) {
        if (row[columns[i]] && row[columns[i]].toString().toLowerCase().indexOf(items_filter) > -1) {
          return true;
        }
      }
      return false;
    });

    this.cdr.markForCheck();
  }

  public getItems() {
    const obs = this.elimsAdminService.getItems_api();
    return obs;
  }

  public openPopUp = (data: any = {}, isNew) => {

    // setup Dialog
    const structure: FlexibleDialogStructure = new FlexibleDialogStructure();
    this.DialogStructure = structure;
    this.DialogStructure.AdditionalSubmitData = [new FlexibleDialogElement_NVP('assetId', data.id)];

    this.DialogStructure.Title = 'Asset';

    if (isNew) {
      this.DialogStructure.ChangeType = FlexibleDialog_ChangeType.Add;
    } else {
      this.DialogStructure.ChangeType = FlexibleDialog_ChangeType.Edit;
    }

    this.DialogData = new Array();

    Object.entries(data).forEach(entry => {
      const NVP = new FlexibleDialogElement_NVP(entry[0], entry[1] as string);
      this.DialogData.push(NVP);
    });

    this.DialogStructure.Title = 'Asset';
    this.DialogStructure.ShowRemove = false;

    const dialogRef: MatDialogRef<any> = this.FlexDialog.open(FlexibleDialogComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        structure: this.DialogStructure,
        elements: this.DialogElements,
        datas: this.DialogData,
      }
    });

    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        // If user press cancel
        return;
      }
      this.progressBar.mode = 'indeterminate';
      if (isNew) {

        // We have not built out add assets
        this.elimsAdminService.addItem_api(res)
          .subscribe(data => {
            this.Load();
            this.snack.open('Asset Added!', 'OK', { duration: 4000 })
          })
      } else {


        this.elimsAdminService.updateItem_api(res)
          .subscribe(data => {
            this.Load();
            this.snack.open('Asset Updated!', 'OK', { duration: 4000 })
          })
      }
    })
  }

  viewDetails(row) {
    // this.Router.navigate(['/', 'manage', 'detail', row.id], { relativeTo: this.route }).then(nav => {
    this.Router.navigate(['..', 'detail', row.id], { relativeTo: this.route }).then(nav => {
      console.log(nav); // true if navigation is successful
    }, err => {
      console.log(err) // when there's an error
    });
  }

  // GetWellName(WellSiteID){
  //
  //   let WellName = this.WellSiteList.map(objectMap =>{
  //     if(objectMap.id === WellSiteID){
  //       // matching id, now return
  //
  //       return objectMap.name;
  //     }
  //     // return nothing
  //     return null;
  //   })
  //   return WellName;
  // }



}
