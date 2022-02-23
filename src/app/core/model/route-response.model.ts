export class RouteResponse{
  status: string;
  path: Array<Array<string>>;
  total_distance: number;
  total_time: number;


  constructor(status?: string, path?:Array<Array<string>>, total_distance?: number, total_time?: number){
    this.status = status || '';
    this.path = path || [];
    this.total_distance = total_distance || 0;
    this.total_time = total_time || 0
  }
}
