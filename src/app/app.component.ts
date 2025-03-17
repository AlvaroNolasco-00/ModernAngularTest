import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountryService } from './services/country/country.service';
import { UsersService } from './services/users/users.service';
import { UserType } from './types/users';
import { UserAvatarComponent } from './shareds/user-avatar/user-avatar.component';
import { FlagComponent } from './shareds/flag/flag.component';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, filter, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { PrefixPhonePipe } from './pipes/prefix-phone/prefix-phone.pipe';
import { countryItem, getCountryListResponse } from './types/country';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserAvatarComponent, FlagComponent, PrefixPhonePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-new-test';

  private countryService = inject(CountryService)
  private userServices = inject(UsersService)

  private countryList = new BehaviorSubject<countryItem[] | undefined>(undefined)

  public userList = signal<UserType[]>([])
  private textToSearch = new BehaviorSubject('')

  private subscriptions: Subscription[] = []

  ngOnInit(): void {

    const countriesPartams = {
      page: 1, perPage: 100000
    }
    this.countryService.getCountries(countriesPartams).subscribe({
      next: (value) => this.countryList.next(value[1])
    })
    const userParams = {
      limit: 25,
      page: 1
    }
    const usersSubscribe =
      this.textToSearch.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((text) => {
          if (!!text) return this.userServices.searchUserByText({ page: userParams.page, limit: userParams.limit, text }).pipe(
            catchError(() => of([]))
          )
          return this.userServices.getAllUsers(userParams).pipe(
            catchError(() => of([]))
          )
        }),
        switchMap((response) => {
          if (response?.length > 0) return this.countryList.pipe(
            filter((value) => value !== undefined)
          ).pipe(
            map((countriesResponse) => {
              const newUserList = response.map((user) => {
                const countryItem = countriesResponse.filter((country) => user.country === country.iso2Code)?.at(0)
                user.countryItem = countryItem
                return user
              })
              return newUserList
            })
          )
          return of(response)
        })
      ).subscribe({
        next: (value) => {
          this.userList.set(value)
        }
      })
    this.subscriptions.push(usersSubscribe)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }

  public inputFieldText = (event: Event) => {
    const inputElement = event.target as HTMLInputElement
    console.log(inputElement.value)
    this.textToSearch.next(inputElement.value)
  }

}
