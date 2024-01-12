import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FxPurchasingComponent } from './fx-purchasing.component';


describe('FxPurchasingComponent', () => {
  let component: FxPurchasingComponent;
  let fixture: ComponentFixture<FxPurchasingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FxPurchasingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FxPurchasingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
