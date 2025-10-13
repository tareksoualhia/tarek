import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVideoCallComponent } from './admin-video-call.component';

describe('AdminVideoCallComponent', () => {
  let component: AdminVideoCallComponent;
  let fixture: ComponentFixture<AdminVideoCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVideoCallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVideoCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
