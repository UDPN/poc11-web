import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbdcTransactionComponent } from './cbdc-transaction.component';


describe('CbdcTransactionComponent', () => {
  let component: CbdcTransactionComponent;
  let fixture: ComponentFixture<CbdcTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CbdcTransactionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CbdcTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
