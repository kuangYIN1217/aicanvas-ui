/**
 * Created by use on 2017/11/2.
 */
import { Directive,ElementRef,Input,HostListener} from '@angular/core';
@Directive({
  selector:'[MyBeautifulBackground]'
})

export class BeautifulBackgroundDirective{
  el:HTMLElement;
  _default = 'red';
  @Input('YourBeautifulBackground') backgroundColor:string;
  setStyle(color){
    this.el.style.backgroundColor=color;
  }
  constructor(el:ElementRef){
    this.el = el.nativeElement;
    this.setStyle(this._default);
  }
  @HostListener('click') onClick(){
    this.setStyle(this.backgroundColor||this._default);
  }
}
