import { Types } from "mongoose";

export class LoginUserRequestDto {
  email: string;
  password: string;
}

export class LoginUserResponseDto {
  accessToken: string
}

export interface AccessTokenPayload {
  userId: Types.ObjectId
}
