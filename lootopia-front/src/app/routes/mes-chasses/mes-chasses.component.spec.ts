import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesChassesComponent } from './mes-chasses.component';

describe('MesChassesComponent', () => {
  let component: MesChassesComponent;
  let fixture: ComponentFixture<MesChassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesChassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesChassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
