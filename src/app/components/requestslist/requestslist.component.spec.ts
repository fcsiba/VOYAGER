import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestslistComponent } from './requestslist.component';

describe('RequestslistComponent', () => {
  let component: RequestslistComponent;
  let fixture: ComponentFixture<RequestslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestslistComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
