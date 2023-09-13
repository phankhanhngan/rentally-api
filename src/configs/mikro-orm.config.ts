import { Options } from '@mikro-orm/core';

export const MikroOrmConfig = (): Options => {
  return {
    debug: process.env.LOCAL_MODE === 'true',
    allowGlobalContext: true,
    entities: ['dist/entities/*.entity.js'],
    entitiesTs: ['src/entities/*.entity.ts'],
    type: 'mysql',
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    migrations: {
      snapshot: true,
      tableName: 'migrations',
      path: 'dist/database/migrations',
      pathTs: 'src/database/migrations',
    },
  };
};

export default MikroOrmConfig;
