import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { HttpService } from '../http.service';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps'; 
import { MarkerLabel } from '@agm/core/services/google-maps-types';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  id: string;
  zoom: number;

  submitted_by: string;
  name: string;
  description: string;
  start_time: Date;
  start_time_string: string;
  end_time: Date;
  end_time_string: string;
  liked_by: any;
  visited_by: any;
  partnerships: any;

  location_id: string;
  location_name: string;
  lat: number;
  lng: number;
  addr: string;
  location: marker;
  err_list: any;
  private sub: any;

  month: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(private _httpService: HttpService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
    this.sub = this._route.params.subscribe(params => {
      this.id = params['id'];
      this.getEvent();
    });
  }

  getEvent()
  {
    var observable = this._httpService.getEvent(this.id);
    observable.subscribe((data: any) => {
      console.log(data);
      if(data.error)
      {
        this.err_list = data.error;
      }
      else
      {
        this.submitted_by = data.submitted_by;
        this.name = data.name;
        this.description = data.description;

        this.start_time = new Date(data.start_time);
        this.start_time_string = this.start_time.toLocaleDateString('en-US',{weekday: 'long', year: 'numeric', month: 'long',day: 'numeric',timeZone: 'UTC'}) + ' @ ' + this.start_time.toLocaleTimeString('en-US',{timeZone: 'UTC'}).substr(0,this.start_time.toLocaleTimeString('en-US',{timeZone: 'UTC'}).length-6) + this.start_time.toLocaleTimeString('en-US',{timeZone: 'UTC'}).substr(this.start_time.toLocaleTimeString('en-US',{timeZone: 'UTC'}).length-3,this.start_time.toLocaleTimeString('en-US',{timeZone: 'UTC'}).length);

        this.end_time = new Date(data.end_time);
        this.end_time_string = this.end_time.toLocaleDateString('en-US',{weekday: 'long', year: 'numeric', month: 'long',day: 'numeric',timeZone: 'UTC'}) + ' @ ' + this.end_time.toLocaleTimeString('en-US',{timeZone: 'UTC'}).substr(0,this.end_time.toLocaleTimeString('en-US',{timeZone: 'UTC'}).length-6) + this.end_time.toLocaleTimeString('en-US',{timeZone: 'UTC'}).substr(this.end_time.toLocaleTimeString('en-US',{timeZone: 'UTC'}).length-3,this.end_time.toLocaleTimeString('en-US',{timeZone: 'UTC'}).length);

        this.liked_by = data.liked_by;
        this.visited_by = data.visited_by;
        this.partnerships = data.partnerships;
        this.location_id = data.location;
        this.getLocation();
      }
    });
  }

  getLocation()
  {
    var observable = this._httpService.getLocation(this.location_id);
    observable.subscribe((data: any) => {
      console.log(data);
      if(data.error)
      {
        this.err_list = data.error;
      }
      else
      {
        this.location_name = data.name;
        this.lat = data.latitude;
        this.lng = data.longitude;
        this.initMap();
      }
    });
  }

  initMap() {
    this.zoom = 14;
    this._httpService.setCurrentPosition();
    this.mapsAPILoader.load();
    this.userMarker();
  }

  userMarker()
  {
    var locMarker = {
      name: this.location_name,
      lat: this.lat,
      lng: this.lng,
      draggable: false
    };
    this.location = locMarker;
  }

  trimTime(theTime)
  {
    while(theTime.substr(theTime.length-3,theTime.length) == ':00')
    {
      theTime = theTime.substr(0,theTime.length-3);
    }
    return theTime;
  }
}

// Market Type
interface marker{
  name?: string,
  lat: number,
  lng: number,
  draggable: boolean
}
