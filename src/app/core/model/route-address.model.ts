// export interface RouteAddress{
//     origin: string;
//     destination: string;
// }

export class RouteAddress{
    origin: string;
    destination: string;

    constructor(origin?: string, destination?: string){
      this.origin = origin || '';
      this.destination = destination || '';
    }
}
