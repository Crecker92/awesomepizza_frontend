import { Component, Input } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'ap-page',
  imports: [MatProgressBar],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {
  @Input({ required: true }) title!: string;
  @Input() showProgressBar?: boolean = false;
}
