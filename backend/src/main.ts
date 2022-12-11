/*
 * Created on Sat Dec 09 2022
 * @Author:- Dhrumil Shah
 */

import { ExpressAdapter, NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express'
import * as http from 'http'
import * as path from "path";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {

  const server = express()

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server)
  );

  app.setGlobalPrefix("v1")

  const options = new DocumentBuilder()
    .setTitle('Minddeft-Task')
    .setDescription('Backend service for listing wallets and amount')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("api-docs", app, document)

  app.enableCors();

  app.useStaticAssets(path.join(__dirname, "/../assets"));

  await app.init();


  const port = 8055

  http.createServer(server).listen(port)
}
bootstrap();
