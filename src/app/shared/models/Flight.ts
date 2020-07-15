export class Flight {
    sortTime : string;
    departureTime: Time;
    arrivalTime : Time;
    carrier : Carrier;
    url : string;
    operatedBy : string;
    airport : Airtport;
    departureAirport :string;
    arrivalAirport:string;
    fare : number = 10000;
}

class Time{
    timeAMPM : string;
    time24:  string;
}

class Carrier {
    fs: string;
    name: string;
    flightNumber:string;
}

class Airtport {
    fs: string;
    city: string;
}