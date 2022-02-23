import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { RouteAddress } from './core/model/route-address.model';
import { RoutesService } from './core/services/routes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Decorator wires up blockUI instance
  @BlockUI() blockUI!: NgBlockUI;
  @ViewChild('myMap', { static: true }) myMap!: ElementRef;
  title = 'map_app';
  lat = 51.678418;
  lng = 7.809007;

  getWayPointsForm!: FormGroup;
  pickup!: string;
  dropoff!: string;
  token!: string;
  hasFormErrors!: boolean;
  errorMessage: string = 'Fill in the form appropriately';
  waypoints = [];
  passedData = {};
  timeout = 0;
  response: any = {};

  constructor(
    private fBuilder: FormBuilder,
    private routesService: RoutesService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.searchForm();
    let loader = new Loader({
      apiKey: ''
    });
    this.blockUI.start('Loading page... please wait')

    loader.load().then(() => {
      new google.maps.Map(this.myMap.nativeElement, {
        center: { lat: 9.085198, lng: 7.497654 },
        zoom: 6
      })
      this.blockUI.stop()
    })
  }


  searchForm(): FormGroup {
    return this.getWayPointsForm = this.fBuilder.group({
      pickup: ['', Validators.required],
      dropoff: ['', Validators.required]
    })
  }


  prepareData(): RouteAddress {
    const controls = this.getWayPointsForm.controls;
    const _data = new RouteAddress();
    _data.origin = controls['pickup'].value;
    _data.destination = controls['dropoff'].value;
    return _data;
  }

  reset(): void {
    this.searchForm();
    this.hasFormErrors = false;
    this.getWayPointsForm.markAsPristine();
    this.getWayPointsForm.markAsUntouched();
    this.getWayPointsForm.updateValueAndValidity();
}
  onSubmit(): any {
    this.hasFormErrors = false;
    const controls = this.getWayPointsForm.controls;
    /** check form */
    if (this.getWayPointsForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.hasFormErrors = true;
      return;
    }
    const address = this.prepareData();

    this.getWayPoints(address);
  }

  getWayPoints(data: RouteAddress): void {
    this.blockUI.start('Making a server request... Please Wait')
    // this.blockUI.start('Drawing Routes... Please Wait')
    this.routesService.postRoutingRequest(data).subscribe({
      next: (response) => {
        this.token = response.token;
        this.getPointsDetails(data, this.token);
      },
      error: (error) => {
        const message = 'Error occurred';
        // const message = this.routesService.handleError(error)
        this.toastr.error(message, error);
        this.blockUI.stop();
      }
    },

    );
  }


  getPointsDetails(data: any, token: string) {
    this.blockUI.start('Getting waypoints response from server.... Please Wait')
    this.routesService.getWayPointsUsingToken(token).subscribe({

      next: (response) => {

        //Assign response from server to member variable response
        this.response = response;


         //check for failure
         if (response.status === 'failure') {
          this.blockUI.stop();
        }

        //check for in-progress
        if (response.status === 'in progress') {
          this.blockUI.start('Retrying request.... please wait');

        }
        //Check for success condition
        if (this.response.status === 'success') {

          const waypoints = response?.path.map(([lat, lng]) => ({ lat, lng }))
          const newWaypoints = waypoints.map((item) => {
            const result = {
              location: parseFloat(item.lat) + ',' + parseFloat(item.lng),
              stopover: false,
            }
            return result;
          });
          this.toastr.success('Successul operation...')
          this.blockUI.stop();
          this.drawingRoute(data.origin, data.destination, newWaypoints);
        }


      },
      error: (error) => {
        this.toastr.error('Error occured..', error)
        this.blockUI.stop();
      }
    });
  }




  drawingRoute(origin: any, dest: any, waypts?: Array<any>,) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsService.route({
      origin: origin,
      destination: dest,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      // console.log(response)
      if (status == google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(response);
      }
    })
    this.blockUI.stop();
  };

}
