import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewEncapsulation } from '@angular/core';
import { TemplatesComponent } from './templates.component';

// TestBed.configureTestingModule({
// }).overrideComponent(TemplatesComponent, {add: {encapsulation: ViewEncapsulation.Native}})

describe('TemplatesComponent', () => {
  let component: TemplatesComponent;
  let fixture: ComponentFixture<TemplatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesComponent ]
    })
    // .overrideComponent(TemplatesComponent, {add: {encapsulation: ViewEncapsulation.Native}})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
