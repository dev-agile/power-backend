const dotenv = require("dotenv");

let ENV_FILE_NAME;
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL;

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  /*{
    resolve: `medusa-plugin-prometheus`,
    options: {
      uriPath: "/monitoring",
      authentication: true,
      onAuthenticate: (req, username, password) => {
        return username === process.env.PROM_USER_NAME && password === process.env.PROM_USER_PASS
      },
    },
  },*/
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
  {
    resolve: `medusa-file-s3`,
    options: {
      s3_url: process.env.S3_URL,
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      access_key_id: process.env.S3_ACCESS_KEY_ID,
      secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
      cache_control: process.env.S3_CACHE_CONTROL,
    },
  },
  {
    resolve: `medusa-plugin-ip-lookup`,
    options: {
      access_token: process.env.IPSTACK_ACCESS_KEY,
    },
  },
  /*{
    resolve: "medusa-plugin-ses",
    options: {
      access_key_id: process.env.SES_ACCESS_KEY_ID,
      secret_access_key: process.env.SES_SECRET_ACCESS_KEY,
      region: process.env.SES_REGION,
      from: process.env.SES_FROM,
      template_path: process.env.SES_TEMPLATE_PATH,
      partial_path: process.env.SES_PARTIAL_PATH,
      // optional string containing email address separated by comma
      order_placed_cc: 'person1@example.com,person2@example.com',
      enable_endpoint: process.env.SES_ENABLE_ENDPOINT,
      enable_sim_mode: process.env.SES_ENABLE_SIM_MODE
    }
  },*/
  {
    resolve: `medusa-plugin-algolia`,
    options: {
      applicationId: process.env.ALGOLIA_APP_ID,
      adminApiKey: process.env.ALGOLIA_ADMIN_API_KEY,
      settings: {
        products: {
          indexSettings: {
            searchableAttributes: ["title", "description"],
            attributesToRetrieve: [
              "id",
              "title",
              "description",
              "handle",
              "thumbnail",
              "variants",
              "variant_sku",
              "options",
              "collection_title",
              "collection_handle",
              "images",
            ],
          },
        },
      },
    },
  },
  {
    resolve: `medusa-custom-attributes`,
    options: {
      enableUI: true,
      projectConfig: {
        store_cors: STORE_CORS,
        admin_cors: ADMIN_CORS,
      },
    },
  },

];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: process.env.CACHE_REDIS_URL,
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: process.env.CACHE_REDIS_URL,
      ttl: 30,
    }
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  redis_url: REDIS_URL
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
