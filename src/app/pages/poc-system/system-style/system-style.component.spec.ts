/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SystemStyleComponent } from './system-style.component';


describe('SystemStyleComponent', () => {
  let component: SystemStyleComponent;
  let fixture: ComponentFixture<SystemStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
