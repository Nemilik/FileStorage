import { Component, OnInit } from '@angular/core';

import { FlashMessagesService } from 'angular2-flash-messages';
import { CheckValidUserService } from '../services/checkValidUser/check-valid-user.service';
import { SignupService } from '../services/signup/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  step: any = {
    one: true
  };

  email: string = "";
  password: string = "";
  rePassword: string = "";

  constructor(
    private checkForm: CheckValidUserService,
    private flashMessages: FlashMessagesService,
    private signupService: SignupService
  ) { }

  ngOnInit(): void {
  }

  regStepOne() {
    if (!this.checkForm.checkEmail(this.email)) {
      this.flashMessages.show('Некорректные данные', {
        cssClass: 'alert-danger',
        timeout: 4000
      });

      return false;
    }

    this.step = {two: true};
    
    return true;
  }

  signup() {
    if (!this.checkForm.checkEmail(this.password) || !this.checkForm.checkEmail(this.rePassword)) {
      this.flashMessages.show('Некорректные данные', {
        cssClass: 'alert-danger',
        timeout: 4000
      });

      return false;
    }

    if (this.password != this.rePassword) {
      this.flashMessages.show('Пароли не совпадают', {
        cssClass: 'alert-danger',
        timeout: 4000
      });

      return false;
    }

    const user = {
      email: this.email,
      password: this.password
    }

    const result = this.signupService.signupUser(user);

    result.subscribe((data) => {
      console.log(data)
    },
      error => console.log(error)
    );;

    return true;
  }
}
