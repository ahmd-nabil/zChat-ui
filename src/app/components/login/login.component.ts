import { Component } from '@angular/core';
import { OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    })
  }

  login() {
    this.authService.login(this.loginForm.get('username')!.value, this.loginForm.get('password')!.value);
  }

  onForgotPassword() {
    console.log('forgot')
  }

  onRegister() {
    console.log('register')
  }

}
