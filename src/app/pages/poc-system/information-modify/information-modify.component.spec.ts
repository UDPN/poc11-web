import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformationModifyComponent } from './information-modify.component';


describe('InformationModifyComponent', () => {
  let component: InformationModifyComponent;
  let fixture: ComponentFixture<InformationModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformationModifyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InformationModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
