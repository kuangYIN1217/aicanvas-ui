import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningTaskComponent } from './running-task.component';

describe('RunningTaskComponent', () => {
  let component: RunningTaskComponent;
  let fixture: ComponentFixture<RunningTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
