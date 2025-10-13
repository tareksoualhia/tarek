import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContratsComponent } from './update-contrats.component';

describe('UpdateContratsComponent', () => {
  let component: UpdateContratsComponent;
  let fixture: ComponentFixture<UpdateContratsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateContratsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateContratsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
