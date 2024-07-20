interface GeoTypes {
  lat: string;
  lng: string;
}

interface AddressTypes {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: GeoTypes;
}

interface CompanyType {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface UserTypes {
  id: number;
  name: string;
  imageUrl: string;
  username: string;
  email: string;
  address: AddressTypes;
  phone: string;
  website: string;
  company: CompanyType;
}
