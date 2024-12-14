export type RegisterUserRequestDto = {
  name: string;
  email: string;
  password: string;
}

export type RegisterUserResponseDto = Pick<RegisterUserRequestDto, 'name' | 'email'> 
