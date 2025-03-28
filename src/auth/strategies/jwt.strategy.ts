import { Injectable, ExecutionContext } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt.types';

interface GraphQLContext {
  req: Request;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: (req: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(req);
        const {
          req: { headers },
        } = ctx.getContext<GraphQLContext>();
        const authHeader = headers.authorization;
        if (!authHeader) {
          return null;
        }
        const [, token] = authHeader.split(' ');
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    return this.usersService.findOne(payload.sub);
  }
}
