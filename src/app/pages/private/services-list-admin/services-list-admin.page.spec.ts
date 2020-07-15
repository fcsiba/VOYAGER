import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServicesListAdminPage } from './services-list-admin.page';

describe('ServicesListAdminPage', () => {
  let component: ServicesListAdminPage;
  let fixture: ComponentFixture<ServicesListAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesListAdminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesListAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
