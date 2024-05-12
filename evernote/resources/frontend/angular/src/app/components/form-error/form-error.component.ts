import {Component, Input} from '@angular/core';

@Component({
  selector: 'en-form-error',
  standalone: true,
  imports: [],
  templateUrl: './form-error.component.html',
  styleUrl: './form-error.component.scss'
})
export class FormErrorComponent {
  @Input() error: string | undefined;
}
