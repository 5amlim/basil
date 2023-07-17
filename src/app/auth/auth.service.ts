import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

const BACKEND_URL = environment.apiUrl + '/auth/'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    return this.http
      .post(BACKEND_URL + 'signup', authData)
      .subscribe(() => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false)
      })

  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + 'login', authData)
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration)
          this.isAuthenticated = true;
          this.userId = response.userId
          this.authStatusListener.next(true);
          const now = new Date()
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000) 
          this.saveAuthData(token, expirationDate, this.userId)
          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false)
      });
  }

  autoAuthUser(){
    const authData = this.getAuthData()
    if (!authData) {
      return
    }
    const now = new Date()
    const expiresIn = authData.expirationDate.getTime() - now.getTime()
    if (expiresIn > 0) {
      this.token = authData.token
      this.isAuthenticated = true
      this.userId = authData.userId
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true)
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration)
    this.tokenTimer = setTimeout(() => { this.logoutUser() }, duration * 1000)
  }

  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private saveAuthData(token:string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId)
  }

  private clearAuthData() {
    localStorage.removeItem("token")
    localStorage.removeItem("expiration")
    localStorage.removeItem("userId")
  }

  private getAuthData() {
    const token = localStorage.getItem('token')
    const expirationDate = localStorage.getItem('expiration')
    const userId = localStorage.getItem('userId')
    if (!token || ! expirationDate) {
      throw new Error('No token or expiration available.')
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
