const BaseValidator = require('./base');

const AppConstants = require('./../../settings/constants');
const Utility = require('./../utility');

class PasswordValidator extends BaseValidator {
  constructor () {
    super ();
  }
  validate (str) {
    if (!super.validator(str, BaseValidator.Types.STRING)) {
      return false;
    }
    if(!str) {
      return Utility.PASS_MISSING;
    }
    let passRegExp = AppConstants.PASSWORD_REG_EXP;
    if (passRegExp.test(str)) {
      return Utility.ErrorTypes.SUCCESS;
    }
    return Utility.ErrorTypes.INVALID_PASSWORD;
  }
}

module.exports = new PasswordValidator ();
