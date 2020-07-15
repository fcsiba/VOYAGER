import { Component, OnInit } from '@angular/core';
import { Attendant } from 'src/app/shared/models/Attendants';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  attendants : Attendant[] = [];
  constructor(
    private modalCtrl : ModalController
  ) { }

  ngOnInit() {
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

}
