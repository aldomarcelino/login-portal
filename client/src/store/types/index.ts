export interface UserTypes {
  id: string;
  full_name: string;
  image_url: string;
  phone_number?: string;
  email: string;
  login_count?: string;
  is_login: boolean;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
