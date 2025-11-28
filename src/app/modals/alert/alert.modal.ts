import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MAT_DIALOG_DATA, MatDialogTitle, MatDialogClose } from "@angular/material/dialog";

@Component({
  selector: 'ap-alert',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton],
  templateUrl: './alert.modal.html',
  styleUrl: './alert.modal.scss'
})
export class AlertModal {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }
  ) { }

}
