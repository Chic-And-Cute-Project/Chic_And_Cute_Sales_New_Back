import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { UsersModule } from './core/users/users.module';
import { ProductsModule } from './core/products/products.module';
import { DiscountsModule } from './core/discounts/discounts.module';
import { InventoriesModule } from './core/inventories/inventories.module';
import { RemissionGuidesModule } from './core/remission-guides/remission-guides.module';
import { SalesModule } from './core/sales/sales.module';
import { CloseSalesDayModule } from './core/close-sales-day/close-sales-day.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        UsersModule,
        ProductsModule,
        DiscountsModule,
        InventoriesModule,
        RemissionGuidesModule,
        SalesModule,
        CloseSalesDayModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
