import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { User } from '../../interfaces/interfaces'

@Injectable({
  providedIn: 'root'
})

export class SignupService {

  constructor(private http: HttpClient) { }

  signupUser(user: User) {
    console.log(user)
    const body = {
      id: user.email,
      password: user.password
    }
    return this.http.post('http://localhost:4000/signup', body);
  }

  loginUser(user: User) {

  }
}