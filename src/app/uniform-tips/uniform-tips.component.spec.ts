import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformTipsComponent } from './uniform-tips.component';

describe('UniformTipsComponent', () => {
  let component: UniformTipsComponent;
  let fixture: ComponentFixture<UniformTipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniformTipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniformTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
