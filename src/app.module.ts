import { Global, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphqlModule } from './graphql/graphql.module';
import { join } from 'path';
import { DatabaseModule } from './provider/database/database.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      include: [GraphqlModule],
      autoSchemaFile: join(process.cwd(), 'src/schema/graphql'),
      sortSchema: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts')
      }
    }),
    GraphqlModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
