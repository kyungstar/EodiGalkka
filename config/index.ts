import {HASH, JWT, LOG, FILE,  MONGO, MYSQL, SMS_PAY, SECURITY, SERVER, SMTP} from "./Security";


export const RUN_MODE = process.argv[3]


interface LogConfig {
    PATH: string;
    LEVEL: string;
    FILE_SIZE: number;
    FILE_CNT: number;
}

interface FileConfig {
    PATH: string,
    IMG_FILE_SIZE: number,
    MOV_FILE_SIZE: number
}

interface Config {
    PROTOCOL: {
        [key: string]: SERVER;
    };
    SERVER: {
        TYPE: SERVER;
        PORT: SERVER;
    };
    DB: {
        [key: string]: {
            "MONGO": {
                "URL": MONGO
            },
            "MYSQL": {
                "HOST": MYSQL,
                "PORT": MYSQL,
                "USER": MYSQL,
                "PASSWORD": MYSQL,
                "DATABASE": MYSQL,
                "CONNECTION_LIMIT": MYSQL
            },
            "SECURITY": {
                "KEY": SECURITY
            }
        };
    },
    LOG: LogConfig,
    JWT: {
        [key: string]: {
            SECRET_KEY: JWT,
            EXPIRES_IN: JWT
        }
    },
    SMTP: {
        USER_EMAIL: SMTP,
        USER_PASSWD: SMTP
    },
    PAY: {
        SMS: {
            URL: SMS_PAY,
            MERCHANT_KEY: SMS_PAY
        }
    },
    HASH: {
        ITERATIONS: HASH,
        KEY_LENGTH: HASH,
        DIGEST: HASH,
        KEY: HASH
    },
    FILE: FileConfig
}




const targetConfig: Config = {
    "PROTOCOL": {
        "DEV": SERVER.DEV_PROTOCOL,
        "REL": SERVER.PROTOCOL
    },
    "SERVER": {
        "TYPE": SERVER.TYPE,
        "PORT": SERVER.PORT
    },
    "DB": {
        "REL": {
            "MONGO": {
                "URL": MONGO.URL
            },
            "MYSQL": {
                "HOST": MYSQL.HOST,
                "PORT": MYSQL.PORT,
                "USER": MYSQL.USER,
                "PASSWORD": MYSQL.PASSWORD,
                "DATABASE": MYSQL.DATABASE,
                "CONNECTION_LIMIT": MYSQL.CONNECTION_LIMIT
            },
            "SECURITY": {
                "KEY": SECURITY.KEY
            }
        },
        "DEV": {
            "MONGO": {
                "URL": MONGO.DEV_URL
            },
            "MYSQL": {
                "HOST": MYSQL.DEV_HOST,
                "PORT": MYSQL.DEV_PORT,
                "USER": MYSQL.DEV_USER,
                "PASSWORD": MYSQL.DEV_PASSWORD,
                "DATABASE": MYSQL.DEV_DATABASE,
                "CONNECTION_LIMIT": MYSQL.DEV_CONNECTION_LIMIT
            },
            "SECURITY": {
                "KEY": SECURITY.KEY
            }
        },
    },
    LOG,
    "JWT": {
        "DEV": {
            "SECRET_KEY": JWT.DEV_SECRET_KEY,
            "EXPIRES_IN": JWT.EXPIRES_IN
        },
        "REL": {
            "SECRET_KEY": JWT.SECRET_KEY,
            "EXPIRES_IN": JWT.EXPIRES_IN
        },
    },
    "SMTP": {
        "USER_EMAIL": SMTP.USER_EMAIL,
        "USER_PASSWD": SMTP.USER_PASSWD
    },
    "PAY": {
        "SMS": {
            "URL": SMS_PAY.URL,
            "MERCHANT_KEY": SMS_PAY.MERCHANT_KEY
        }
    },
    "HASH": {
        "ITERATIONS": HASH.ITERATIONS,
        "KEY_LENGTH": HASH.KEY_LENGTH,
        "DIGEST": HASH.DIGEST,
        "KEY": HASH.KEY
    },
    FILE
}

export default targetConfig;
