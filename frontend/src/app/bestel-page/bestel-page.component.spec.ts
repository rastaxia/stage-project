import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestelPageComponent } from './bestel-page.component';

describe('BestelPageComponent', () => {
  let component: BestelPageComponent;
  let fixture: ComponentFixture<BestelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestelPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
