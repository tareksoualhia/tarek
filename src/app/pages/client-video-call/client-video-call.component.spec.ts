import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientVideoCallComponent } from './client-video-call.component';

describe('ClientVideoCallComponent', () => {
  let component: ClientVideoCallComponent;
  let fixture: ComponentFixture<ClientVideoCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientVideoCallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientVideoCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
