import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://sa:DoAn2025%40@localhost:27017/nestgraphql?authSource=admin',
      {
        directConnection: true,
      },
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: {
        settings: {
          'editor.theme': 'dark',
          'editor.fontSize': 14,
          'editor.cursorShape': 'line',
          'schema.polling.enable': false,
        },
      },
    }),
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
