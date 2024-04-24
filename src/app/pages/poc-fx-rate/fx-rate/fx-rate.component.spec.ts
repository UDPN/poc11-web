import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FxRateComponent } from './fx-rate.component';


describe('FxRateComponent', () => {
  let component: FxRateComponent;
  let fixture: ComponentFixture<FxRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FxRateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FxRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
