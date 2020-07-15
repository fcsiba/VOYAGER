import { VehicleType } from "../enums/enums";

export class Search {
  destination: string = "";
  source: string = "";
  scheduleDate: string;
  vehicleType: VehicleType;
  medium : string;
  timings:string;
}
