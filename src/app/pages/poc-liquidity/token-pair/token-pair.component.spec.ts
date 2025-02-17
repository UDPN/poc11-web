import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenPairComponent } from './token-pair.component';

describe('TokenPairComponent', () => {
  let component: TokenPairComponent;
  let fixture: ComponentFixture<TokenPairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenPairComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TokenPairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
