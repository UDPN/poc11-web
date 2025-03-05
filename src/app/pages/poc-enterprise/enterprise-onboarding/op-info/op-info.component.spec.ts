import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpInfoComponent } from './op-info.component';

describe('OpInfoComponent', () => {
  let component: OpInfoComponent;
  let fixture: ComponentFixture<OpInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
