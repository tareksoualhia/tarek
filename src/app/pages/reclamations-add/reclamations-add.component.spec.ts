import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationsAddComponent } from './reclamations-add.component';

describe('ReclamationsAddComponent', () => {
  let component: ReclamationsAddComponent;
  let fixture: ComponentFixture<ReclamationsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReclamationsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReclamationsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
