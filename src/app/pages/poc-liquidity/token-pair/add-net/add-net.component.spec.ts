import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNetComponent } from './add-net.component';

describe('AddNetComponent', () => {
  let component: AddNetComponent;
  let fixture: ComponentFixture<AddNetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNetComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
