import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, interval, Subscription } from 'rxjs';
import { GlobalService } from '@services/global-service/global-service.service';
import { I18nPluralPipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @Input() notificPanel;

  itemPluralMapping = {
    'Alarm': {
      '=0' : '0 Alarms',
      '=1' : '1 Alarm',
      'other' : '# Alarms'
    },
    'Notification': {
      '=0' : 'Alarms',
      '=1' : 'Alarm',
      'other' : 'Alarms'
    },    
  };

  public obsInterval: Observable<any>;
  public arrAlarms: Array<any>;
  public notifications: Object[] = Array();

  constructor(
    private router: Router,
    private globalService: GlobalService,
  ) {
    this.globalService.obs.subscribe(data => this.RefreshAlarms(data.Alarms));
  }

  ngOnInit() {
    this.router.events.subscribe((routeChange) => {
      if (routeChange instanceof NavigationEnd) {
        this.notificPanel.close();
      }
    });
  }

  clearAll(e) {
    e.preventDefault();
    this.notifications = [];
  }

  RefreshAlarms(arrAlarms: any) {
    // clear them out 
    this.notifications = Array();
    //    = [{
    //   message: 'New contact added',
    //   icon: 'assignment_ind',
    //   time: '1 min ago',
    //   route: '/inbox',
    //   color: 'primary'
    // }, {
    //   message: 'New message',
    //   icon: 'chat',
    //   time: '4 min ago',
    //   route: '/chat',
    //   color: 'accent'
    // }, {
    //   message: 'Server rebooted',
    //   icon: 'settings_backup_restore',
    //   time: '12 min ago',
    //   route: '/charts',
    //   color: 'warn'
    // }]
    arrAlarms.forEach(Alarm => {
      let obj: Object = new Object();
      obj['message'] = Alarm.alarmName;
      obj['time'] = 'Now';
      obj['color'] = 'warn';
      obj['route'] = '/alarms/alarms';
      obj['currVal'] = Alarm.currVal;
      obj['setpoint'] = Alarm.setpoint;
      obj['pointName'] = Alarm.pointName;

      this.notifications.push(obj);
    });
  }
}
