import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChassesAuxTresorsComponent } from './chasses-aux-tresors.component';

describe('ChassesAuxTresorsComponent', () => {
  let component: ChassesAuxTresorsComponent;
  let fixture: ComponentFixture<ChassesAuxTresorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChassesAuxTresorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChassesAuxTresorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
