import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoOperationComponent } from './info-operation.component';

describe('InfoOperationComponent', () => {
  let component: InfoOperationComponent;
  let fixture: ComponentFixture<InfoOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoOperationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
