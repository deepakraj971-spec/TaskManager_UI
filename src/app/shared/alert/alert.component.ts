import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../core/services/error.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  constructor(public errors: ErrorService) {}
}
