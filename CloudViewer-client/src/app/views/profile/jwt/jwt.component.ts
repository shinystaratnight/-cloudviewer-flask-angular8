import { Component, OnInit } from '@angular/core';
// import { debug } from 'util';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-jwt',
  templateUrl: './jwt.component.html',
  styleUrls: ['./jwt.component.scss']
})
export class JwtComponent implements OnInit {

  JWT: string;
  environment = environment;
  constructor() {

  }

  ngOnInit() {
    this.JWT = localStorage.getItem('token');
  }

}
