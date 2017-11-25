const BaseValidator = require('./base');

const PasswordValidator = require('./password_validator');
const UsernameValidator = require('./username_validator');

const Utility = require('./../utility');
const AppConstants = require('./../../settings/constants');

class UserValidator extends BaseValidator {
  constructor() {
    super();
  }

  validateUsername(username, sanitize) {

    if (!username) {

      return Utility.ErrorTypes.USERNAME_MISSING;
    }
    if (username.length < AppConstants.USERNAME_MIN_LENGTH
      || username.length > AppConstants.USERNAME_MAX_LENGTH)
      {
        return Utility.ErrorTypes.INVALID_USERNAME_RANGE;
      }
      return UsernameValidator.validate(username);

  }

  validatePassword(password, sanitize) {
    if (!password) {
      return Utility.ErrorTypes.PASSWORD_MISSING;
    }
    if (password.length < AppConstants.PASSWORD_MIN_LENGTH
      || password.length > AppConstants.PASSWORD_MAX_LENGTH)
      {
        return Utility.ErrorTypes.INVALID_PASSWORD_RANGE;
      }
      return PasswordValidator.validate(password);
    }
    validateName(name) {
      return NameValidator.validate(name);
    }
    validateAge (age) {
      return AgeValidator.validate(age);
    }
    validateEmail (email) {
      return EmailValidator.validate(email);
    }
  }

  module.exports = new UserValidator();
