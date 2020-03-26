import { NgModule, Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ElimsAdminService } from '../../elims_admin.service';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { CompanyTablePopupComponent } from './company-table-popup/company-table-popup.component';
import { Subscription } from 'rxjs';
import { egretAnimations } from '@shared/animations/egret-animations';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  animations: egretAnimations,
})
export class CompaniesComponent implements OnInit {
  @ViewChild(MatProgressBar, { static: false }) progressBar: MatProgressBar;

  myForm: FormGroup;
  public items: any[] = Array();
  public items_filtered: any[] = Array();

  public MyText: String;

  constructor(
    private dialog: MatDialog,
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

  ngOnInit() {
    const fork = forkJoin(
      this.getCustomers(),
    );

    fork.subscribe(
      data => {
        const Customers = data['0'];

        this.updateFilter(false); // in case there is an active filter
        this.progressBar.mode = 'determinate';
        this.cdr.markForCheck();
      }
    );
  }

  updateFilter(event) {

    // copy Items list to filered list.....into a new, unreferenced array
    this.items_filtered = this.items.slice();

    // no filter text
    let items_filter = this.myForm.controls['filterText'].value;
    if (items_filter == '') return true;

    items_filter = items_filter.toLowerCase();

    let columns = Object.keys(this.items_filtered[0]);

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

  public getCustomers() {
    const obs = this.elimsAdminService.getCustomers_api();
    obs.subscribe(data => {
      this.items = data['customers'];
      this.updateFilter(false); // in case there is an active filter
    })
    return obs;
  }

  public openPopUp = (data: any = {}, isNew?) => {
    

    if (isNew) {
      data = Object();
      data.id = 0;
      data.CompanyName = '';
      data.epCustomerID = '';
      data.custRecDelivery = true;
      data.Title = 'Add Company';

    } else {
      data.Title = 'Update Company';
      data.CompanyName = data.name;
    }

    const dialogRef: MatDialogRef<any> = this.dialog.open(CompanyTablePopupComponent, {
      width: '720px',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }

        this.loader.open();
        if (isNew) {
          this.elimsAdminService.addCustomer_api(res)
            .subscribe(data => {
              this.getCustomers();
              this.loader.close();
              this.snack.open('Customer Added!', 'OK', { duration: 4000 })
              this.cdr.markForCheck();
            })
        } else {
          
          this.elimsAdminService.updateCustomer_api(res)
            .subscribe(data => {
              this.getCustomers();
              this.loader.close();
              this.snack.open('Customer Updated!', 'OK', { duration: 4000 })
              this.cdr.markForCheck();
            })
        }
      })
  }

  deleteItem(row) {
    
    this.confirmService.confirm({ message: `Delete ${row.name}?` })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          
          this.elimsAdminService.removeCustomer_api(row)
            .subscribe(data => {
              let obs = this.getCustomers();
              obs.subscribe(data => {
                this.loader.close();
                this.snack.open('Customer deleted!', 'OK', { duration: 4000 })
                this.cdr.markForCheck();
              });
            })
        }
      })
  }


}
