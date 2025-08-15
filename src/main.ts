import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Qr-Backend')
        .addBearerAuth(
            {
                type: 'http',
            },
            'jwt-auth'
        )
        .addServer(process.env.NODE_ENV === 'production' ? '/qr' : '/')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.enableCors();

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
