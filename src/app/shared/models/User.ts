import { UserType } from '../enums/enums';

export class User {
    id : string = "";
    fullName: string = "";
    photoUrl : string= "";
    createdOn : number;
    firstName: string ;
    lastName: string ;
    email: string ;
    phoneNumber: string;
    type : UserType;
    verified:number = 1;
    services : string[]= [];
    requests : string[]= [];
    cnic : string;
}