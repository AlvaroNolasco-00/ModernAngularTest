import { countryItem } from "./country";

export type UserType = {
  "id": number;
  "first_name": string;
  "last_name": string;
  "country": string;
  "email": string;
  "phone": string;
  "gender": string;
  "website": string;
  "created_at": Date;
  "updated_at": Date;
  countryItem?: countryItem;
}
