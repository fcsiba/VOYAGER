import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RequestedPage } from './requested.page';

describe('RequestedPage', () => {
  let component: RequestedPage;
  let fixture: ComponentFixture<RequestedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
