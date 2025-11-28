import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertModal } from '../modals/alert/alert.modal';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private dialog: MatDialog
  ) { }

  openAlert(title: string, message: string) {
    return this.dialog.open(AlertModal, {
      data: { title, message }
    });
  }

  openErrorAlert(message: string) {
    return this.openAlert("Error", message);
  }
}
