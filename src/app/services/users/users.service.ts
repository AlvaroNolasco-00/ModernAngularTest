import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserType } from '../../types/users';

type usersRequestParams = { limit: number; page: number; }

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject(HttpClient)

  constructor() { }

  public getAllUsers = (params: usersRequestParams) => {
    return this.http.get<UserType[]>(`https://649088911e6aa71680cb6c15.mockapi.io/users?limit=${params.limit}&page=${params.page}`)
  }
}
