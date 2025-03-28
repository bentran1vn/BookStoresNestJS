import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthType)
  async login(@Args('input') authInput: AuthInput): Promise<AuthType> {
    return this.authService.login(authInput);
  }

  @Mutation(() => AuthType)
  async refreshToken(@Args('token') token: string): Promise<AuthType> {
    return this.authService.refreshToken(token);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(): Promise<boolean> {
    return this.authService.logout();
  }
}
