import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindUserComponent } from './find-user.component';

describe('FindUserComponent', () => {
  let component: FindUserComponent;
  let fixture: ComponentFixture<FindUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindUserComponent]
    });
    fixture = TestBed.createComponent(FindUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
