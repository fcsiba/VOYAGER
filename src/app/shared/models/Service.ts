import { Attendant } from './Attendants';
import { VehicleType } from '../enums/enums';

export class Service {
  id: string = "";
  createdOn: number;
  vendorId: string = "";
  vendorName: string = "";
  vendorPhotoUrl: string = "";
  vendorPhoneNumber : string = "";
  source: string = "";
  destination: string = "";
  price: number;
  scheduleDate: string;
  vehicleType: VehicleType;
  regnNo: string;
  attendants :  Attendant[] = [];
  requests :  Attendant[] = [];
  call : string;
  description : string;
  seats : number;
  expired : boolean = false;
}
