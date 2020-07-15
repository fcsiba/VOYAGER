import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/shared/services/client-service/routing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
   private routingService : RoutingService
  ) { }

  ngOnInit() {
  }

  goToDashboard(){
    this.routingService.goToDashboard();
  }

}
