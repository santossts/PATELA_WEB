import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubprocesosComponent } from './subprocesos.component';

describe('SubprocesosComponent', () => {
  let component: SubprocesosComponent;
  let fixture: ComponentFixture<SubprocesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubprocesosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubprocesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
