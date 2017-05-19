import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InferenceModelComponent } from './inference-model.component';

describe('InferenceModelComponent', () => {
  let component: InferenceModelComponent;
  let fixture: ComponentFixture<InferenceModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InferenceModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InferenceModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
