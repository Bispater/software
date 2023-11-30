import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UniqueUsersComponent } from './unique-users.component';

describe('UniqueUsersComponent', () => {
  let component: UniqueUsersComponent;
  let fixture: ComponentFixture<UniqueUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UniqueUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
