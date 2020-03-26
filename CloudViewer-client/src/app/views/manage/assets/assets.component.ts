import { NgModule, Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { AssetsService } from './assets.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { AssetTablePopupComponent } from './asset-table-popup/asset-table-popup.component';
import { Subscription } from 'rxjs';
import { egretAnimations } from '@shared/animations/egret-animations';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

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

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private assetService: AssetsService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {

    this.myForm = this.fb.group({
      filterText: [''],
    });
  }

  ngOnInit() {
    this.LoadTable();
  }

  LoadTable() {
    let values = forkJoin(
      this.getItems(),
      this.getWellSites(),
    );

    values.subscribe(
      data => {
        let Items = data['0'];
        const WellSites = data['1'];

        // const UpdatedItems = Items.map(Item_objectMap =>{
        //   const WellSiteName = WellSites.map(WellSites_objectMap =>{
        //     if(Item_objectMap.activewellsite == WellSites_objectMap.id){
        //       return WellSites_objectMap.name;
        //     }else{
        //       return null;
        //     }
        //   });
        //   Item_objectMap.activewellsitename = WellSiteName;
        //   return Item_objectMap;
        // });

        Items.forEach(Item => {
          WellSites.forEach(WellSite => {
            if (Item.activewellsite == WellSite.id) {
              Item.activewellsitename = WellSite.name;
            }
          });
        });

        Items.forEach(Item => {
          if (Item.activewellsitename == null || Item.activewellsitename == '') {
            Item.activewellsitename = 'N/A';
          }

        });

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
    let obs = this.assetService.getItems_api();
    this.getItemSub = obs.subscribe(data => {
      // this.items = data;
      // this.progressBar.mode = 'determinate';
      // this.cdr.markForCheck();
    })
    return obs;
  }

  public getWellSites() {
    let obs = this.assetService.getWellSites_api();
    this.getWellsSub = obs.subscribe(data => {
      this.WellSiteList = Array();
      let obj: any = new Object();
      obj.name = '';
      obj.id = '';
      this.WellSiteList.push(obj);

      let WellSites = data;
      WellSites.map(function (WellSite) {
        if (WellSite.name) {
          let obj: any = new Object();
          obj.name = WellSite.name;
          obj.id = WellSite.id;
          this.WellSiteList.push(obj);
        }
      }, this);

      // Sort Data
      function compare(a, b) {
        if (a.wellName < b.wellName) {
          return -1;
        }
        if (a.wellName > b.wellName) {
          return 1;
        }
        return 0;
      }

      this.WellSiteList.sort(compare);
      this.cdr.markForCheck();

    })
    return obs;
  }


  public openPopUp = (data: any = {}, isNew?) => {
    const title = 'Update Asset';

    const StateDataList = Array();
    StateDataList.push('', 'Standby', 'Picking up chemical', 'Going to wellsite', 'At Well site');

    const StatusDataList = Array();
    StatusDataList.push('', 'Moving', 'Stand Still');

    


    const IP: string = data.IPAddress;
    let arrIP = ['', '', '', ''];
    if (IP !== undefined && IP.indexOf('.')) {
      arrIP = IP.split('.');
    }

    
    let dialogRef: MatDialogRef<any> = this.dialog.open(AssetTablePopupComponent, {
      width: '720px',
      disableClose: true,
      data: {
        title: title,
        AssetName: data.name,
        StateDataList: StateDataList,
        StatusDataList: StatusDataList,
        ID: data.ID,
        State_Current: data.state,
        Status_Current: data.status,
        Chemical_Current: data.chemical,
        WellSite_Current: data.activewellsite,
        WellSiteDataList: this.WellSiteList
      }
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          // We have not built out add assets
          // this.assetService.addItem(res)
          //     .subscribe(data => {
          //       this.items = data;
          //       this.loader.close();
          //       this.snack.open('Asset Added!', 'OK', { duration: 4000 })
          //     })
        } else {
          //
          // collapse IP address

          this.assetService.updateItem_api(dialogRef, data, res)
            .subscribe(data => {
              this.items = this.items.map(objectMap => {
                if (objectMap.id === data.id) {
                  // matching id, now update
                  objectMap.state = data.state;
                  objectMap.status = data.status;
                  objectMap.activewellsite = data['active well site'];

                  // fill in wellsite name
                  this.WellSiteList.forEach(WellSite => {
                    if (objectMap.activewellsite == WellSite.id) {
                      objectMap.activewellsitename = WellSite.name;
                    }
                  });

                  return objectMap;
                }
                // return unchanged
                return objectMap;
              });


              this.LoadTable();
              this.loader.close();
              this.snack.open('Asset Updated!', 'OK', { duration: 4000 })
              this.cdr.markForCheck();
            })
        }
      })
  }

  viewDetails(row) {
    this.router.navigate(['../detail/' + row.id], { relativeTo: this.route }).then(nav => {
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
