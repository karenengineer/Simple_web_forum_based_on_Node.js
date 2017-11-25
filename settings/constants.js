const AppConstants = {
    DB_URL: '127.0.0.1:27017/fdb',
    USERNAME_MIN_LENGTH: 4,
    USERNAME_MAX_LENGTH: 24,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 80,

    USERNAME_REG_EXP: /^[\w+_]{4,24}$/,
    PASSWORD_REG_EXP: /^[\w+_-]{6,20}$/,
    NUMBER_REG_EXP: /^[+-]?(([0-9])+([.][0-9]*)?|[.][0-9]+)$/,
    SYMBOL_REG_EXP: /^[!@#\$%\^\&*\)\(+=~._-]+$/,

    OFFSET_DEFAULT_VALUE: 0,
    LIMIT_DEFAULT_VALUE: 20

}

module.exports = AppConstants;
