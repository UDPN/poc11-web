import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyCapitalFixComponent } from './currency-capital-fix.component';

describe('CurrencyCapitalFixComponent', () => {
  let component: CurrencyCapitalFixComponent;
  let fixture: ComponentFixture<CurrencyCapitalFixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyCapitalFixComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyCapitalFixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
