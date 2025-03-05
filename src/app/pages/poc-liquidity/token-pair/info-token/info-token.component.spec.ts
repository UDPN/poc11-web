import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoTokenComponent } from './info-token.component';

describe('InfoTokenComponent', () => {
  let component: InfoTokenComponent;
  let fixture: ComponentFixture<InfoTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoTokenComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
