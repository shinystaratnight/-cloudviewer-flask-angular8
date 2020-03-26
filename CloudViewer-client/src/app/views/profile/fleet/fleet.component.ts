import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss']
})
export class FleetComponent implements OnInit {

  allDistricts: any[];
  selectedDistricts: any[];

  constructor(
    private ProfileService: ProfileService,
  ) { }

  ngOnInit() {
    // Fetch all the districts
    this.ProfileService.GetAllDistricts().subscribe(data => {
      this.allDistricts = data;
      console.log(data);
    });

    // Fetch selected districts
    this.ProfileService.GetSelectedDistricts().subscribe(data => {
      this.selectedDistricts = data;
      console.log(data);
    });
  }

  onAdd() {
    // this.ProfileService.AddDistrict(1).subscribe();
    this.allDistricts = this.allDistricts.filter(t => t.id != 1);
    this.ProfileService.AddDistrict(2).subscribe(newDistrict => {
      this.selectedDistricts.push(newDistrict);
    });
    
  }

  onRemove() {
    this.ProfileService.RemoveDistrict(1).subscribe();
  }

}
