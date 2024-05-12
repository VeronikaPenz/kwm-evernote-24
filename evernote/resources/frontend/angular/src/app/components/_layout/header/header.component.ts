import {Component} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {AuthenticationService} from "../../../shared/services/authentication.service";

@Component({
  selector: 'en-header',
  standalone: true,
  imports: [
    ButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    public authService: AuthenticationService) {
  }
}
