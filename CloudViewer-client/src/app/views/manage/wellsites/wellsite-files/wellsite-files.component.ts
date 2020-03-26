import { Component, OnInit, AfterContentInit, AfterContentChecked, AfterViewChecked, OnDestroy, ViewChild, ChangeDetectorRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { AppConfirmService } from '@services/app-confirm/app-confirm.service';
import { AppLoaderService } from '@services/app-loader/app-loader.service';
import { Subscription, Observable } from 'rxjs';
import { egretAnimations } from '../../../../shared/animations/egret-animations';
import { MatProgressBar, MatButton } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { merge, forkJoin, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { GlobalService } from '@services/global-service/global-service.service';
import { WellsitesService } from '../wellsites.service';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Component({
  selector: 'app-wellsite-files',
  templateUrl: './wellsite-files.component.html',
  styleUrls: ['./wellsite-files.component.scss'],
  animations: egretAnimations
})
export class WellsiteFilesComponent implements OnInit {

  FileList: Object[] = Array();

  id: any;

  selectedFiles: FileList;

  accessKeyId = localStorage.getItem('AWS_ID');
  secretAccessKey = localStorage.getItem('AWS_SECRET');
  CompanyID = localStorage.getItem('customerID');
  S3: any;

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

    this.id = this._Activatedroute.snapshot.paramMap.get('id');
    this.S3 = new S3(
      {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
        region: 'us-east-2'
      }
    );
  }

  ngOnInit() {
    this.UpdateFileList();
  }

  UpdateFileList() {
    const Prefix = this.CompanyID + '/' // + this.id + '/';
    const params = {
      Bucket: 'otr.customerfiles',
      MaxKeys: 200,
      Prefix: Prefix,
      //Delimiter: '/',
      //StartAfter: Prefix
    };
    this.S3.listObjectsV2(params, this.S3FileList.bind(this));
  }

  S3FileList(err, data) {

    if (err === null && data.Contents && data.Contents.length) {

      let files = data.Contents.filter(row => { return row.Key.startsWith(this.CompanyID + '/' + this.id + '/') })

      if (files && files.length) {
        files.forEach((element, i, arr) => {

          const params = {
            Bucket: 'otr.customerfiles',
            Key: element.Key
          };

          data.Contents[i].SignedURL = this.S3.getSignedUrl('getObject', params);

          data.Contents[i].Key = element.Key.split('/')[2];

        });

        this.FileList = data.Contents;
        this.cdr.markForCheck();
      }
    }

  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    
    const file = this.selectedFiles.item(0);

    const params = {
      Bucket: 'otr.customerfiles',
      Key: this.CompanyID + '/' + this.id + '/' + file.name,
      Body: file
    };

    this.S3.upload(params, this.S3Upload_Callback.bind(this));
  }

  S3Upload_Callback(err, data) {
    
    this.UpdateFileList();
    this.snack.open('File Added!', 'OK', { duration: 4000 })
  }




}
