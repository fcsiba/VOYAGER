import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/shared/models/Service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-service-info',
  templateUrl: './service-info.component.html',
  styleUrls: ['./service-info.component.scss'],
})
export class ServiceInfoComponent implements OnInit {
  service : Service;
  validate : boolean;
  constructor(private modalCtrl : ModalController) { }

  ngOnInit() {
    console.log(this.service);
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

}
