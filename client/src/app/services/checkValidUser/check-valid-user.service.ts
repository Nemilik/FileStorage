import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckValidUserService {

  constructor() { }

  checkEmail(email: string) {
    if (!email) {
      return false;
    }

    return true;
  }

  checkPassword(password: string) {
    if (!password) {
      return false;
    }

    return true;
  }
}
