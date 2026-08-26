import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorsSchedule } from './doctors-schedule';

describe('DoctorsSchedule', () => {
  let component: DoctorsSchedule;
  let fixture: ComponentFixture<DoctorsSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsSchedule],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorsSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
