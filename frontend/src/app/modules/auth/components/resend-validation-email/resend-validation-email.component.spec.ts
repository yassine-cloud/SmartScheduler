import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendValidationEmailComponent } from './resend-validation-email.component';

describe('ResendValidationEmailComponent', () => {
  let component: ResendValidationEmailComponent;
  let fixture: ComponentFixture<ResendValidationEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResendValidationEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendValidationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
