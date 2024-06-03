import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) {}

    register(
        username: string,
        email: string,
        password: string,
    ): Observable<any> {
        return this.http.post(`${this.baseUrl}/users/register`, {
            username,
            email,
            password,
        });
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/users/login`, {
            username,
            password,
        });
    }

    loggedIn(): Observable<any> {
        return this.http.get(`${this.baseUrl}/users/loggedIn`);
    }

    currentUsername(): Observable<any> {
        let ret = this.http.get(`${this.baseUrl}/users/currentUsername`);
        return ret;
    }

    saveUsername(username: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/users/set/${username}`);
    }

    updateUsername(username: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/users/updateUsername`, {
            username,
        });
    }
}
