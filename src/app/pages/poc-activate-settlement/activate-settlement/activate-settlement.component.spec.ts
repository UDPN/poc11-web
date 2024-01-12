import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivateSettlementComponent } from './activate-settlement.component';


describe('ActivateSettlementComponent', () => {
  let component: ActivateSettlementComponent;
  let fixture: ComponentFixture<ActivateSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivateSettlementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivateSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
