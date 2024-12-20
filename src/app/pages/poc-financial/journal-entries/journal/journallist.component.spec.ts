import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JournallistComponent } from './journallist.component';

describe('JournallistComponent', () => {
  let component: JournallistComponent;
  let fixture: ComponentFixture<JournallistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournallistComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(JournallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
