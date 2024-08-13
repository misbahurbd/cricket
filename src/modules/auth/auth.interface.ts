export interface IRegister {
  name: string
  email: string
  mobile: string
  password: string
  country: string
}

export interface ILogin {
  username: string
  password: string
}

export interface IChangePassword {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface IForgetPassword {
  identifier: string
}

export interface IResetPassword {
  password: string
  confirmPassword: string
}
