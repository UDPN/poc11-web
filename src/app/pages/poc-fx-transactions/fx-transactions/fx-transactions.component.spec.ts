import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FxTransactionsComponent } from './fx-transactions.component';


describe('FxTransactionsComponent', () => {
  let component: FxTransactionsComponent;
  let fixture: ComponentFixture<FxTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FxTransactionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FxTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
