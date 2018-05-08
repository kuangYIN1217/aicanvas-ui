import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManageComponent } from './authority-manage.component';

describe('AuthorityManageComponent', () => {
  let component: AuthorityManageComponent;
  let fixture: ComponentFixture<AuthorityManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorityManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorityManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
