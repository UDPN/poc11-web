import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyForeignFixComponent } from './currency-foreign-fix.component';

describe('CurrencyForeignFixComponent', () => {
  let component: CurrencyForeignFixComponent;
  let fixture: ComponentFixture<CurrencyForeignFixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyForeignFixComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyForeignFixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
