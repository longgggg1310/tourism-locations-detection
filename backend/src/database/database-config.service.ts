import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor() {}
    async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
        const opts = await getConnectionOptions();
        return {
            ...opts,
            autoLoadEntities: true,
            synchronize: false,
        };
    }
}
