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
  birthday: string
}
export interface User extends UserInfo {
  id:string,
}

export interface UserRegister extends UserInfo {
  code: string
}
