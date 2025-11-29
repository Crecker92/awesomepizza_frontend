import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertModal } from '../modals/alert/alert.modal';

describe('AlertService', () => {
  let service: AlertService;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
    dialog = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open alert', () => {
    const openSpy = spyOn(dialog, 'open').and.stub();
    service.openAlert('title', 'message');
    expect(openSpy).toHaveBeenCalledOnceWith(AlertModal, {
      data: {
        title: 'title',
        message: 'message'
      }
    });
  });

  it('should open error alert', () => {
    const openSpy = spyOn(dialog, 'open').and.stub();
    service.openErrorAlert('message');
    expect(openSpy).toHaveBeenCalledOnceWith(AlertModal, {
      data: {
        title: 'Error',
        message: 'message'
      }
    });
  });
});
