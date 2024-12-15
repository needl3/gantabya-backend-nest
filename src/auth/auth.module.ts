import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { JWT_SECRET_IDENTIFIER } from "src/common/constants/env.constants";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    UserModule,
    ConfigModule,
    // TODO: Make it static and crash if secret is not set
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET_IDENTIFIER),
        signOptions: {
          expiresIn: '1d'
        }
      }),
    })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
