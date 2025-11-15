import 'dotenv/config';
import * as joi from 'joi';

interface EnvConfig {
  PORT: number;
  CONTENTFUL_SPACE_ID: string;
  CONTENTFUL_ACCESS_TOKEN: string;
  CONTENTFUL_ENVIRONMENT: string;
  CONTENTFUL_CONTENT_TYPE: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  NODE_ENV: string;
}

const envSchema = joi
  .object<EnvConfig>({
    PORT: joi.number().default(3000),
    CONTENTFUL_SPACE_ID: joi.string().required(),
    CONTENTFUL_ACCESS_TOKEN: joi.string().required(),
    CONTENTFUL_ENVIRONMENT: joi.string().required(),
    CONTENTFUL_CONTENT_TYPE: joi.string().required(),
    DATABASE_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRATION: joi.string().required(),
    NODE_ENV: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envConfig = value;

export const envs = {
  PORT: envConfig.PORT,
  CONTENTFUL_ACCESS_TOKEN: envConfig.CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_SPACE_ID: envConfig.CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT: envConfig.CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_CONTENT_TYPE: envConfig.CONTENTFUL_CONTENT_TYPE,
  DATABASE_URL: envConfig.DATABASE_URL,
  JWT_SECRET: envConfig.JWT_SECRET,
  JWT_EXPIRATION: envConfig.JWT_EXPIRATION,
  NODE_ENV: envConfig.NODE_ENV,
};
