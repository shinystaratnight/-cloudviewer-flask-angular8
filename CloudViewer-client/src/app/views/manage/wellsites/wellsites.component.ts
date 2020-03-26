import { Component, OnInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy, ViewChild, ChangeDetectorRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { Subscription, Observable } from 'rxjs';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, forkJoin, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { GlobalService } from '@services/global-service/global-service.service';
import { WellsitesService } from './wellsites.service';

@Component({
  selector: 'app-wellsites',
  templateUrl: './wellsites.component.html',
  styleUrls: ['./wellsites.component.scss'],
  animations: egretAnimations
})
export class WellsitesComponent implements OnInit, OnDestroy {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;

  myForm: FormGroup;
  public items: any[];
  public items_filtered: any[];

  public WellSites: any[];
  public getItemSub: Subscription;

  public arr_States: object[];

  constructor(
    private dialog: MatDialog,
    private _Activatedroute: ActivatedRoute,
    private snack: MatSnackBar,
    private wellsiteService: WellsitesService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private fb: FormBuilder,
  ) {
    this.myForm = this.fb.group({
      filterText: [''],
    });

    let obs: Observable<any>[] = Array();

    // for the dropdowns
    obs.push(this.wellsiteService.getAllWellSite_States_api());
    forkJoin(obs).subscribe(data => this.FillForm(data));

    this.CheckForReturnFromModify();
  }

  FillForm(data) {
    this.arr_States = data[0];
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

  ngOnInit() {
    let obs: Observable<any>;
    let sub: Subscription;

    obs = this.wellsiteService.getAllWellSites_api();
    sub = obs.subscribe(data => {
      
      // data['State'] = this.arr_States[data.state];
      this.items = data;
      this.updateFilter(false);
      this.progressBar.mode = 'determinate';
      this.cdr.markForCheck();
    });
  }

  CheckForReturnFromModify() {
    const id = this._Activatedroute.snapshot.paramMap.get("id");
    const action = this._Activatedroute.snapshot.paramMap.get("action");

    this.location.replaceState("/manage/wellsites");

    if (action == null) {
      // do nothing
    } else if (action == 'created') {
      this.snack.open('Well Site Created', 'OK', { duration: 4000 })
    } else {
      this.snack.open("Well Site #" + id + " Modified", 'OK', { duration: 4000 })
    }
  }

  ngOnDestroy(): void {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe();
    }
  }

}
