import { Component, OnInit } from "@angular/core";
import { User } from "src/app/shared/models/User";
import { StorageService } from "src/app/shared/services/client-service/storage.service";
import { UserType, Collection, VehicleType, TravelType } from "src/app/shared/enums/enums";
import { CloudFirestoreService } from "src/app/shared/services/database-service/cloud-firestore-service";
import { UtilService } from "src/app/shared/services/client-service/util.service";
import { RoutingService } from "src/app/shared/services/client-service/routing.service";
import { Service } from "src/app/shared/models/Service";
import { Search } from "src/app/shared/models/Search";
import { Cities } from "src/app/helpers/cities";
import { Attendant } from "src/app/shared/models/Attendants";
import { AlertController, Platform } from "@ionic/angular";
import { Airports } from 'src/app/helpers/airports';
import { HttpClient } from "@angular/common/http";
import { Flight } from 'src/app/shared/models/Flight';
import { HTTP } from '@ionic-native/http/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage implements OnInit {
  public user: User = new User();
  userTypes: string[];
  users: User[] = [];
  services: Service[] = [];
  flights: Flight[] = [];
  search: Search = new Search();
  sourceCities = Cities;
  airports = Airports.list;
  airlines = Airports.airlines;
  vehicleTypes = Object.keys(VehicleType);
  searched: boolean = false;
  travelTypes = Object.keys(TravelType);
  selectedFilter : string;
  showFilter : boolean = false; 
  currentListing : string;
  constructor(
    private storage: StorageService,
    private cloudFirestoreService: CloudFirestoreService,
    private util: UtilService,
    private routingService: RoutingService,
    private alertCtrl: AlertController,
    private platform: Platform,
    private http: HttpClient,
    private httpNative: HTTP,
    private iab: InAppBrowser,
  ) {}

  async ngOnInit() {
    this.userTypes = Object.keys(UserType);
    this.user = this.storage.getUser();
    if (this.user.type === UserType.admin) {
      await this.getUsers();
    } else if (this.user.type === UserType.vendor) {
      await this.getServicesForVendor();
    } else if (this.user.type === UserType.traveller) {
      console.log("TRAVELLER");
      await this.getAllServicesForTraveller();
    }
  }

  showInfoModal(item : Service,validate:boolean= false){
    this.routingService.showServiceInfoModal(item,validate);
  }

  // ADMIN

  async getUsers() {
    try {
      let users = await this.cloudFirestoreService.getAll(
        "verified",
        0,
        "createdOn",
        "desc",
        Collection.Users
      );
      for (let item of users) {
        let user = new User();
        user = Object.assign(user, item);
        this.users.push(user);
      }
      console.log(this.users);
    } catch (e) {
      this.util.showToast(e.message);
    }
  }

  async approveUser(item: User) {
    let loader = await this.util.showLoader();
    loader.present();
    try {
      let id = JSON.parse(JSON.stringify(this.user.id));
      item.verified = 1;
      await this.cloudFirestoreService.set(item, item.id, Collection.Users);
      this.users = [];
      let admin : any = await this.cloudFirestoreService.get(id,Collection.Users);
      admin = admin.data() as User;
      this.storage.setUser(admin);
      await this.getUsers();
      loader.dismiss();
    } catch (e) {
      loader.dismiss();
      this.util.showToast(e.message);
    }
  }

  // VENDOR

  async servicePopUp(props?: Service) {
    await this.routingService.showServiceFormModal(props);
    await this.getServicesForVendor();
  }

  async attendantsPopUp(item: Service) {
    await this.routingService.showAttendantsModal(item.attendants);
    await this.getServicesForVendor();
  }

  async requestsPopUp(item: Service) {
    await this.routingService.showRequestsModal(item.requests,item.id);
    await this.getServicesForVendor();
  }

  async getServicesForVendor() {
    let loader = await this.util.showLoader();
    loader.present();
    try {
      let services = await this.cloudFirestoreService.getAll(
        "vendorId",
        this.user.id,
        "createdOn",
        "desc",
        Collection.Services
      );
      this.services = [];
      for (let item of services) {
        let service = new Service();
        service = Object.assign(service, item);
        this.services.push(service);
      }
      console.log(this.services);
      loader.dismiss();
    } catch (e) {
      loader.dismiss();
      console.log(e);
      this.util.showToast(e.message);
    }
  }

  //Traveller

  async getAllServicesForTraveller() {
    this.search = new Search();
    this.selectedFilter = "all";
    this.currentListing = TravelType.Road;
    let loader = await this.util.showLoader();
    loader.present();
    try {
      let services = await this.cloudFirestoreService.getAllServicesForTraveller(
        "createdOn",
        "desc",
        Collection.Services
      );
      this.services = [];
      this.flights = [];
      for (let item of services) {
        let service = new Service();
        service = Object.assign(service, item);
        if (!this.user.services.includes(service.id) && !this.user.requests.includes(service.id) && new Date(service.scheduleDate).getTime() + 86400000 > new Date().getTime()) {
          service.expired = false;
          this.services.push(service);
        }
      }
      console.log(this.services);
      this.searched = false;
      loader.dismiss();
    } catch (e) {
      loader.dismiss();
      console.log(e);
      this.util.showToast(e.message);
    }
  }

  async searchServices(){
    if(this.search.medium === TravelType.Road){
      await this.getServicesForTraveller();
      this.currentListing = this.search.medium;
    }else{
      await this.getFlightServices();
      this.currentListing = this.search.medium;
    }
  }

  async getFlightServices(){
    this.searched = true;
    this.services =[];
    let loader = await this.util.showLoader();
    loader.present();
    try {
      let flightsRes : any;
      if(this.platform.is("cordova")){
        flightsRes = await this.httpNative.get(`https://www.flightstats.com/v2/api-next/flight-tracker/route/${this.search.source}/${this.search.destination}/${new Date(this.search.scheduleDate).getFullYear()}/${new Date(this.search.scheduleDate).getMonth()+1}/${new Date(this.search.scheduleDate).getDate()}?numHours=6&hour=${this.search.timings}`,{},{});
        if(flightsRes.status === 200){
          flightsRes=JSON.parse(flightsRes.data);
        }
      }else{
        flightsRes = await this.http.get(`/v2/api-next/flight-tracker/route/${this.search.source}/${this.search.destination}/${new Date(this.search.scheduleDate).getFullYear()}/${new Date(this.search.scheduleDate).getMonth()+1}/${new Date(this.search.scheduleDate).getDate()}?numHours=6&hour=${this.search.timings}`).toPromise();
      }
      this.flights = [];
      for (let item of flightsRes.data.flights) {
        let flight = new Flight();
        flight = Object.assign(flight, item);
        flight.departureAirport = flightsRes.data.header.departureAirport.city;
        flight.arrivalAirport = flightsRes.data.header.arrivalAirport.city;
        let airline = this.airlines[this.airlines.findIndex((airline => airline.fs === flight.carrier.fs))];
        if(airline){
          flight.fare = airline.fare;
          flight.url = airline.url;
        }else{
          flight.url = `https://www.flightstats.com/v2${flight.url}`;
        }
        
        if(flight.carrier.name === "Pakistan International Airlines"){
          flight.carrier.name = "P.I.A";
        }
        this.flights.push(flight);
      }
      console.log(this.flights);
      this.searched = true;
      loader.dismiss();
    } catch (e) {
      loader.dismiss();
      console.log(e);
    }

  }

  visitAirlineSite(item : Flight){
    const browser = this.iab.create(item.url,"_system");
  }

  async getServicesForTraveller() {
    this.flights = [];
    this.selectedFilter = "all";
    this.search.scheduleDate = new Date(
      new Date(this.search.scheduleDate).setHours(0, 0, 0, 0)
    ).toISOString();
    let loader = await this.util.showLoader();
    loader.present();
    try {
      let services = await this.cloudFirestoreService.getAllTraveller(
        this.search.destination,
        this.search.scheduleDate,
        this.search.source,
        "createdOn",
        "desc",
        Collection.Services
      );
      this.services = [];
      for (let item of services) {
        let service = new Service();
        service = Object.assign(service, item);
        if (!this.user.services.includes(service.id) && !this.user.requests.includes(service.id)) {
          if(new Date().getTime() > new Date(service.scheduleDate).getTime() + 86400000){
            service.expired = true;
          }else{
            service.expired = false;
          }
          this.services.push(service);
        }
      }
      console.log(this.services);
      this.searched = true;
      loader.dismiss();
    } catch (e) {
      loader.dismiss();
      console.log(e);
      this.util.showToast(e.message);
    }
  }

  async bookServiceAlert(item: Service){
    let alert = await this.alertCtrl.create({
      message: "Are You Sure ?",
      buttons: [
        {
          text: "No",
        },
        {
          text: "Yes",
          handler: async () => {
                await this.bookService(item);
          },
        },
      ],
    });
    alert.present();
  }

  async bookService(item: Service) {
    let loader = await this.util.showLoader();
    loader.present();
    try {
      let attendant: Attendant = new Attendant();
      attendant.fullName = this.user.fullName;
      attendant.id = this.user.id;
      attendant.phoneNumber = this.user.phoneNumber;
      attendant.photoUrl = this.user.photoUrl;
      item.requests.push(attendant);
      await this.cloudFirestoreService.set(item, item.id, Collection.Services);
      this.user.requests.push(item.id);
      await this.cloudFirestoreService.set(
        this.user,
        this.user.id,
        Collection.Users
      );
      this.util.showToast("Service Request Sent Successfully !");
      this.services = this.services.filter((service)=>{
        if(service.id !== item.id){
          return service;
        }
      });
      loader.dismiss();
    } catch (e) {
      loader.dismiss();
      this.util.showToast(e.message);
    }
  }

  getFilteredServices(){
    return this.services.filter((service)=>{
      if(this.selectedFilter === "all"){
        return service;
      }else if(service.vehicleType === this.selectedFilter){
        return service;
      }
      
    });
  }

  toggleFilter(){
    this.showFilter = !this.showFilter;
  }

  applyFilter(selectedFilter){
    this.selectedFilter = selectedFilter;
    this.toggleFilter();
  }

  
}
