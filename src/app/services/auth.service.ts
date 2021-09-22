import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userIsAuthenticated = false;
  private _userId = 'xyz';

  get userId() {
    return this._userId;
  }

  constructor() { }

  login() {
    this.userIsAuthenticated = true;
  }

  logout() {
    this.userIsAuthenticated = false;
  }
}
