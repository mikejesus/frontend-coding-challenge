import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { RouteAddress } from './core/model/route-address.model';
import { RoutesService } from './core/services/routes.service';
import { API_KEY } from 'secret';
import { throwError } from 'rxjs';

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
  errorMessage: string = 'You must fill in all details';
  waypoints = [];
  passedData = {};
  timeout = 0;
  response: any = {};
  loader: Loader;

  constructor(
    private fBuilder: FormBuilder,
    private routesService: RoutesService,
    private toastr: ToastrService
  ) {

    //Instantiate loader object on component instance creation
    this.loader = new Loader({
      apiKey: API_KEY
    });
  }

  ngOnInit(): void {
    this.searchForm();

    this.blockUI.start('Loading map... please wait')

    this.loader.load().then(() => {
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
    this.response = '';
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

    //Get prepared data from form
    const address = this.prepareData();

    //perform operation
    this.getWayPoints(address);
  }


  /**
   * This method performs request for getting waypoints
   * @param data
   */
  getWayPoints(data: RouteAddress) {
    this.blockUI.stop();
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
        this.toastr.error(message, error.error);
        this.response = '';
        this.blockUI.stop();
      }
    },

    );
  }


  /**
   * Get server response using token gotten from previous request
   * @param data
   * @param token
   */
  getPointsDetails(data: any, token: string) {
    this.blockUI.stop();
    this.blockUI.start('Getting waypoints response from server.... Please Wait')
    this.routesService.getWayPointsUsingToken(token).subscribe({
      next: (response) => {
        //Assign response from server to member variable response
        this.response = response;
        switch (response.status) {
          // case 'in-progress':
          //   this.blockUI.start('Retrying request.... please wait');
          //   /***Retry request */
          //   //Get prepared data from form
          //   const address = this.prepareData();
          //   this.getWayPoints(address);
          //   break;

          case 'success':
            //Transform waypoints received from server
            const waypoints = response?.path.map(([lat, lng]) => ({ lat, lng }))
            const newWaypoints = waypoints.map((item) => {
              const result = {
                location: parseFloat(item.lat) + ',' + parseFloat(item.lng),
                stopover: true,
              }
              return result;
            });
            this.toastr.success('Successul operation...')
            this.blockUI.stop();

            //Call method to render the waypoints on map
            this.drawRoute(data.origin, data.destination, newWaypoints);
            break;
          case 'failure':
            this.toastr.error('Error', "Inaccessible by car")
            this.blockUI.stop();
            break;
          default:
            this.blockUI.stop();
            this.blockUI.start('Retrying request.... please wait');
            //   /***Retry request */
            //   //Get prepared data from form
              const address = this.prepareData();
              this.getWayPoints(address);
        }


        // if (response.status === 'in progress') {
        //   this.blockUI.start('Retrying request.... please wait');
        //   //Get prepared data from form
        //   const address = this.prepareData();
        //   this.getWayPoints(address);
        //   return;

        // }
        // if (response.status === 'failure') {
        //  throwError(()=>response.status)
        //  this.blockUI.stop();
        // }
        // else {
        //   //Check for success condition
        //   // if (this.response.status === 'success') {

        //   const waypoints = response?.path.map(([lat, lng]) => ({ lat, lng }))
        //   const newWaypoints = waypoints.map((item) => {
        //     const result = {
        //       location: parseFloat(item.lat) + ',' + parseFloat(item.lng),
        //       stopover: true,
        //     }
        //     return result;
        //   });
        //   this.toastr.success('Successul operation...')
        //   this.blockUI.stop();
        //   this.drawRoute(data.origin, data.destination, newWaypoints);
        //   // }

        //   return;

        // }






      },
      error: (error) => {
        this.toastr.error('Error', error.error)
        this.blockUI.stop();
      }
    });
  }



  /**
   * Method to draw route with waypoints
   */
  drawRoute(origin: any, dest: any, waypts?: Array<any>) {
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
        directionsRenderer.setMap(this.myMap.nativeElement);
        directionsRenderer.setDirections(response);
        this.blockUI.stop();
      }
    })
    this.blockUI.stop();
  };

}
