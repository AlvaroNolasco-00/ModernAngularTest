import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { countryItem, getCountryListResponse } from '../../types/country';

type isoCodeTypeParam = { isoCode: string }
type getCountriesParamsType = { page: number; perPage: number; }

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private http = inject(HttpClient)

  constructor() { }

  public getCountries = ({ page, perPage }: getCountriesParamsType) => {
    return this.http.get<getCountryListResponse>(`https://api.worldbank.org/v2/country?format=json&page=${page}&per_page=${perPage}`)
  }

  public getCountry = ({ isoCode }: isoCodeTypeParam) => {
    return this.http.get(`https://api.worldbank.org/v2/country/${isoCode}?format=json`)

  }
}
