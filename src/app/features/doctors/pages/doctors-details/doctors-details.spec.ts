import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorsDetails } from './doctors-details';

describe('DoctorsDetails', () => {
  let component: DoctorsDetails;
  let fixture: ComponentFixture<DoctorsDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorsDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
