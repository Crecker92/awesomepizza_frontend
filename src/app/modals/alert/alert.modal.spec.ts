import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertModal } from './alert.modal';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('AlertModal', () => {
  let component: AlertModal;
  let fixture: ComponentFixture<AlertModal>;

  const mockData = {
    title: 'Test title',
    message: 'Test message'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertModal],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AlertModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const element = fixture.debugElement.query(By.directive(MatDialogTitle));
    expect(element.nativeElement.textContent).toContain(mockData.title);
  });

  it('should render the message', () => {
    const element = fixture.debugElement.query(By.directive(MatDialogContent));
    expect(element.nativeElement.textContent).toContain(mockData.message);
  });
});
