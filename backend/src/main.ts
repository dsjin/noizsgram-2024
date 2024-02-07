import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('NoizsGram')
      .setDescription('The cloned Instagram for education purpose.')
      .addBearerAuth()
      .build(),
  )
  SwaggerModule.setup('api', app, document)
  app.enableCors()
  await app.listen(3000)
}
bootstrap()
