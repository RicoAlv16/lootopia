import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChassesComponent } from './chasses.component';

describe('ChassesComponent', () => {
  let component: ChassesComponent;
  let fixture: ComponentFixture<ChassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
