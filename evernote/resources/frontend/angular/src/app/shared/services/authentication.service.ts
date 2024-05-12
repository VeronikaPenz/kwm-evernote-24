import {Injectable} from '@angular/core';
import {jwtDecode} from "jwt-decode";
import {Router} from "@angular/router";
import {ApiService} from "./api.service";

interface Token {
  exp: number
  user: {
    id: number
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private api: ApiService,
    private router: Router) {
  }

  async login(email: string, password: string) {
    return await this.api.issueRequest(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
  }

  returnToLogin() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    this.router.navigateByUrl("/login");
  }

  async logout() {
    try {
      await this.api.issueRequest(`/auth/logout`, {
        method: "POST"
      }).then(async () => {
        this.returnToLogin();
      });
    } catch (e) {
      this.returnToLogin();
    }
  }

  async checkUserStatus(): Promise<string | null> {
    if (sessionStorage.getItem("token") && sessionStorage.getItem("userId")) {
      const token: string = <string>sessionStorage.getItem("token");
      const decodedToken = jwtDecode(token) as Token;
      const expiration: Date = new Date(0);
      expiration.setUTCSeconds(decodedToken.exp);
      if (expiration < new Date()) {
        await this.logout();
        return null;
      }
      return sessionStorage.getItem("userId") ?? null;
    }
    this.returnToLogin();
    return null;
  }

  setSessionStorage(token: string) {
    const decodedToken = jwtDecode(token) as Token;
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('userId', decodedToken.user.id + '');
  }

}
