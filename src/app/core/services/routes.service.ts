import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RouteAddress } from '../model/route-address.model';
import { RouteResponse } from '../model/route-response.model';
import { Token } from '../model/token.model';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  API_URL = environment.baseUrl;
  constructor(private httpClient: HttpClient) { }
  /**
   * Post request to get waypoints
   * @params data
   * @returns token
   */
  postRoutingRequest(data: RouteAddress): Observable<any> {

    return this.httpClient.post<RouteAddress>(this.API_URL + '/route', data, this.getBasicHeaders());
  }

  /**
   * @params token
   * @returns response object
   */
  getWayPointsUsingToken(token: string): Observable<RouteResponse>{
    return this.httpClient.get<RouteResponse>(this.API_URL + `/route/${token}`, this.getBasicHeaders() )
  }


  /**
   * This method is an abstraction to get basic http headers
   * @returns headers
   */
  getBasicHeaders(){
    const httpHeaders = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
    return {headers: httpHeaders}
  }

//   handleError(error: any) {
//     let errorMessage = '';
//     if (error.error instanceof ErrorEvent) {
//         // client-side error
//         errorMessage = `Error: ${error.error.message}`;
//     } else {
//         // server-side error
//         errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//     }
//     console.log(errorMessage);
//     return throwError(()=> new Error(errorMessage));
// }
}
