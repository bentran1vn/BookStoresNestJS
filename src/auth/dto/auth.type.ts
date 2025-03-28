import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class AuthType {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
