import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForeignExchangeApplyComponent } from './foreign-exchange-apply.component';


describe('ForeignExchangeApplyComponent', () => {
  let component: ForeignExchangeApplyComponent;
  let fixture: ComponentFixture<ForeignExchangeApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForeignExchangeApplyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForeignExchangeApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
