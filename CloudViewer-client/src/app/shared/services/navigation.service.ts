import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IMenuItem {
  restricted?: number[];
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {

  plainMenu: IMenuItem[] = [
    {
      name: 'Dashboards',
      type: 'dropDown',
      tooltip: 'Dashboard',
      icon: 'network_check',
      state: 'dashboards',
      sub: [
        { name: 'Map', state: 'mainDashboard', icon: '' },
        { name: 'List', state: 'assetDashboard', icon: '' },
      ]
    },
    // {
    //   name: 'Dashboards',
    //   type: 'link',
    //   tooltip: 'Dashboard',
    //   icon: 'network_check',
    //   state: 'dashboards/mainDashboard'
    // },
    // {
    //   name: 'Assets',
    //   type: 'link',
    //   tooltip: 'Dashboard',
    //   icon: 'airport_shuttle',
    //   state: 'others/blank'
    // },
    // {
    //   name: 'Wellsites',
    //   type: 'link',
    //   tooltip: 'Dashboard',
    //   icon: 'widgets',
    //   state: 'others/blank'
    // },
    // {
    //   name: 'Wells',
    //   type: 'link',
    //   tooltip: 'Dashboard',
    //   icon: 'dashboard',
    //   state: 'others/blank'
    // },
    {
      name: 'Alarms',
      type: 'dropDown',
      tooltip: 'Alarms',
      icon: 'notifications',
      state: 'alarms',
      sub: [
        { name: 'Active Alarm Summary', state: 'summary', icon: '' },
        { name: 'Alarm Configuration', state: 'alarms', icon: '' },
      ]
    },
    // {
    //   name: 'Map',
    //   type: 'link',
    //   tooltip: 'Dashboard',
    //   icon: 'public',
    //   state: 'others/blank'
    // },
    // {
    //   name: 'documents',
    //   type: 'link',
    //   tooltip: 'Dashboard',
    //   icon: 'library_books',
    //   state: 'others/blank'
    // },
    {
      name: 'Manage',
      type: 'dropDown',
      tooltip: 'Manage',
      icon: 'library_books',
      state: 'manage',
      sub: [
        { name: 'Assets', state: 'assets', icon: 'airport_shuttle' },
        { name: 'Well Sites', state: 'wellsites', icon: 'widgets' },
        { name: 'Facilities', state: 'facilities', icon: 'widgets' },
      ]
    },
    {
      name: 'Analytics',
      type: 'dropDown',
      tooltip: 'Analytics',
      icon: 'timeline',
      state: 'analytics',
      sub: [
        { name: 'Trending', state: 'trending', icon: 'timeline' },
      ]
    },
    {
      restricted: [3, 4],
      name: 'ELIMS Admin',
      type: 'dropDown',
      tooltip: 'ELIMS Admin',
      icon: 'notifications',
      state: 'ELIMSAdmin',
      sub: [
        {
          name: 'User List', state: 'users', icon: '', type: 'dropDown', sub: [
            { name: 'User Requests', state: 'requests', icon: '' },
            { name: 'User List', state: 'user-list', icon: '' },
          ]
        },
        {
          name: 'Company', state: 'company', icon: '', type: 'dropDown', sub: [
            { name: 'Companies', state: 'companies', icon: '' },
            { name: 'Districts', state: 'districts', icon: '' },
          ]
        },
        { name: 'Assets', state: 'assets', icon: '' },
        { name: 'Roles', state: 'roles', icon: '' },
      ]
    }
  ];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = 'Frequently Accessed';
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.plainMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  constructor() { }

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.

  publishNavigationChange(menuType: string) {
    // switch (menuType) {
    //   case 'separator-menu':
    //     this.menuItems.next(this.separatorMenu);
    //     break;
    //   case 'icon-menu':
    //     this.menuItems.next(this.iconMenu);
    //     break;
    //   default:
    //     this.menuItems.next(this.plainMenu);
    // }
  }
}
