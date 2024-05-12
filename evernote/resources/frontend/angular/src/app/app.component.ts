import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {FooterComponent} from "./components/_layout/footer/footer.component";
import {HeaderComponent} from "./components/_layout/header/header.component";
import {NavListComponent} from "./components/nav-list/nav-list.component";
import {NgIf} from "@angular/common";
import {AuthenticationService} from "./shared/services/authentication.service";
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonModule,
    HeaderComponent,
    FooterComponent,
    NavListComponent,
    NgIf,
    MessagesModule,
    MessageModule,
    ToastModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  login: boolean;

  constructor(private router: Router,
              private auth: AuthenticationService) {
    this.login = this.router.url === '/login';
  }

  ngOnInit(): void {
    if(!this.auth.checkUserStatus()) this.router.navigateByUrl("/login");
    this.router.events.subscribe(() => {
      this.login = this.router.url === '/login';
    });
  }

}
