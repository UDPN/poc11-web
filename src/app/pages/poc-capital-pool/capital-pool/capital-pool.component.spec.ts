import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapitalPoolComponent } from './capital-pool.component';


describe('CapitalPoolComponent', () => {
  let component: CapitalPoolComponent;
  let fixture: ComponentFixture<CapitalPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CapitalPoolComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CapitalPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
