import {HASH, JWT, LOG, MONGO, MYSQL, SMS_PAY, SECURITY, SERVER, SMTP} from "./Security";

const targetConfig = {
    "PROTOCOL":{
        "DEV":{
            "PROTOCOL": SERVER.DEV_PROTOCOL
        },
        "REL":{
            "PROTOCOL": SERVER.PROTOCOL
        },
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
    "JWT": {
        "DEV": {
            "SECRET_KEY": JWT.DEV_SECRET_KEY
        },
        "REL": {
            "SECRET_KEY": JWT.SECRET_KEY
        },
        "EXPIRES_IN": JWT.EXPIRES_IN
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
    "LOG": {
        "PATH": LOG.PATH,
        "LEVEL": LOG.LEVEL,
        "FILE_SIZE": LOG.FILE_SIZE,
        "FILE_CNT": LOG.FILE_CNT
    },
    "HASH": {
        "ITERATIONS": HASH.ITERATIONS,
        "KEY_LENGTH": HASH.KEY_LENGTH,
        "DIGEST": HASH.DIGEST,
        "KEY": HASH.KEY
    }
}

export default targetConfig;
