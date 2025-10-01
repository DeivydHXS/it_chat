export type TokenInterface = {
  access_token: string
  created_at: string
  expires_at: string
}

export interface UserInfo {
  email: string
  password: string
  password_confirmation: string
  name: string
  nickname: string
  nickname_hash: string
  birthday: string
}

export interface UserInterface extends UserInfo {
  id: string,
  bio: string | null,
  profile_image_url: string | null
}

export interface UserRegister extends UserInfo {
  code: string
}

export interface UserUpdateForm {
  name: string
  nickname: string
  bio?: string
}

export interface UserUpdateErrors {
  name?: string
  nickname?: string
  bio?: string
}