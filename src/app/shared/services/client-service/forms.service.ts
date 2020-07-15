import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: "root"
})
export class FormsService {

  constructor(
    private alertCtrl: AlertController,
    private storage: StorageService,
  ) { }

  getScrollHeight(id:string){
    var elem = document.getElementById(id);
    if(elem){
      return elem.scrollHeight+'px';
    }else{
      return '80vh';
    }
  }

  handleSwipe(id: String, btnId: String, ev: any, dir: String, height: number, onLoad: boolean = false, hideSelector: boolean = false) {
    var elem = document.getElementById('' + id + '');
    var btn = document.getElementById('' + btnId + '');
    let customHeight: number;
    console.log(ev,elem.clientHeight);
    if (height == 60) {
      customHeight = 450;
    } else if (height == 35) {
      customHeight = 220;
    }
    if (hideSelector) {
      elem.style.height = '0vh';
    }
    if (onLoad) {
      this.handleToggle(id, btnId, 2, height);
    } else {
      btn.style.display = 'flex';
    }
    if (dir == 'up') {
      btn.style.display = 'none';
      let value = -1 * ev.deltaY;
      if (value < customHeight) {
        if (value > 30) {
          this.handleToggle(id, btnId, 2, height);
        } else {
          this.handleToggle(id, btnId, 1, height);
        }
      } else {
        btn.style.display = 'flex';
      }
    } else if (dir == 'down') {
      if (ev.deltaY < customHeight) {
        btn.style.display = 'flex';
        if (ev.deltaY < 30) {
          this.handleToggle(id, btnId, 2, height);
        } else {
          this.handleToggle(id, btnId, 1, height);
        }
      } else {
        btn.style.display = 'none';
      }
    }
  }

  handleToggle(id: String, btnId: String, val: Number, height: number) {
    var elem = document.getElementById('' + id + '');
    var btn = document.getElementById('' + btnId + '');
    if (val == 1) {
      setTimeout(function () {
        elem.style.height = '0';
        btn.style.display = 'flex';
      }, 100)
    } else if (val == 2) {
      setTimeout(function () {
        elem.style.height = '' + height + 'vh';
        btn.style.display = 'none';
      }, 100)
    }
  }

  setFocusToNextField(event: any, focusElem: any) {
    if (event.keyCode === 13 || event.key === 'Enter') {
      if (focusElem.valueAccessor) {
        focusElem.valueAccessor.el.nativeElement.setFocus();
      } else {
        focusElem.el.setFocus();
      }
    }
  }

  openSelectField(event: any, focusElem: any) {
    if (event.keyCode === 13 || event.key === 'Enter') {
      if (focusElem.valueAccessor) {
        focusElem.valueAccessor.el.nativeElement.click();
      } else {
        focusElem.el.click();
      }
    }
  }

  formSubmit(event: any, clickElem: any) {
    if (event.keyCode === 13 || event.key === 'Enter') {
      if (clickElem.valueAccessor) {
        clickElem.valueAccessor.el.nativeElement.click();
      } else {
        clickElem.el.click();
      }
    }
  }

  focusToCurrentField(focusElem: any) {
    setTimeout(()=>{
      if (focusElem.valueAccessor) {
        focusElem.valueAccessor.el.nativeElement.focus();
      } else {
        focusElem.el.focus();
      }
    },800);
  }

}