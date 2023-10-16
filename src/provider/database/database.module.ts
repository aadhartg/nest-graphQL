import { Injectable, Module } from "@nestjs/common";
import { MongooseModule, MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";


@Injectable()
export class MongoDBService implements MongooseOptionsFactory {

    constructor() { }
    
    createMongooseOptions(): MongooseModuleOptions {
  
      return {
        uri: "mongodb://localhost:27017/nest-project",
        maxPoolSize: 5
      };
    }
  }

@Module({
    imports: [MongooseModule.forRootAsync({
      useClass: MongoDBService,
    }),],
    providers:[MongoDBService]
  })

export class DatabaseModule {

}