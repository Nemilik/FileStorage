import { Component, OnInit } from '@angular/core';

import { FlashMessagesService } from 'angular2-flash-messages';
import { CheckValidUserService } from '../services/checkValidUser/check-valid-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string = "";

  constructor(
    private checkForm: CheckValidUserService,
    private flashMessages: FlashMessagesService
  ) { }

  ngOnInit(): void {
  }

  login() {
    const user = {
      email: this.email,
      password: this.password
    };

    if (!this.checkForm.checkEmail(user.email) || !this.checkForm.checkPassword(user.password)) {
      this.flashMessages.show('Некорректные данные', {
        cssClass: 'alert-danger',
        timeout: 4000
      });

      return false;
    }

    return false;
  }

}
