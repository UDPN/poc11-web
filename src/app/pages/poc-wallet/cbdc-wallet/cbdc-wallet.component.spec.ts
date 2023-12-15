import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbdcWalletComponent } from './cbdc-wallet.component';


describe('CbdcWalletComponent', () => {
  let component: CbdcWalletComponent;
  let fixture: ComponentFixture<CbdcWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CbdcWalletComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CbdcWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
