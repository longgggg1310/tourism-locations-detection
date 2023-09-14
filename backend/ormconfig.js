module.exports = {
    type: 'postgres',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [process.env.NODE_ENV === 'test' ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js'],
    seeds: ['dist/database/seeds/*.js'],
    factories: ['dist/database/factories/*.js'],
    migrations: ['dist/database/migrations/*.js'],
    cli: {
        migrationsDir: 'src/database/migrations',
    },
    synchronize: false,
    extra: {
        ssl:
            process.env.SSL_MODE === 'require'
                ? {
                      rejectUnauthorized: false,
                  }
                : false,
    },
    logging: false,
};
