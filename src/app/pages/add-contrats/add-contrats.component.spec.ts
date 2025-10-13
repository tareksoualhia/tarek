import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContratsComponent } from './add-contrats.component';

describe('AddContratsComponent', () => {
  let component: AddContratsComponent;
  let fixture: ComponentFixture<AddContratsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContratsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContratsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
