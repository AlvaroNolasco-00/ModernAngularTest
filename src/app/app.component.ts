import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountryService } from './services/country/country.service';
import { UsersService } from './services/users/users.service';
import { UserType } from './types/users';
import { UserAvatarComponent } from './shareds/user-avatar/user-avatar.component';
import { FlagComponent } from './shareds/flag/flag.component';
import { map, of, Subscription, switchMap } from 'rxjs';
import { PrefixPhonePipe } from './pipes/prefix-phone/prefix-phone.pipe';

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


  public userList = signal<UserType[]>([])

  private subscriptions: Subscription[] = []

  ngOnInit(): void {
    const userParams = {
      limit: 25,
      page: 1
    }
    const usersSubscribe = this.userServices.getAllUsers(userParams).pipe(
      switchMap((response) => {
        const countriesPartams = {
          page: 1, perPage: 100000
        }
        if (response?.length > 0) return this.countryService.getCountries(countriesPartams).pipe(
          map((countriesResponse) => {
            const countryList = countriesResponse[1]
            console.log("🚀 ~ AppComponent ~ map ~ countryList:", countryList)
            const newUserList = response.map((user) => {
              const countryItem = countryList.filter((country) => user.country === country.iso2Code)?.at(0)
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
        console.log("🚀 ~ AppComponent ~ this.userServices.getAllUsers ~ value:", value)
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

}
