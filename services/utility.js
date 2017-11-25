const AppConstants = require('./../settings/constants');
const ErrorTypes = {
  SUCCESS: 'success',
  VALIDATION_ERROR: 'validation_error',
  USERNAME_EMPTY:'username line is empty',
  PASSWORD_EMPTY:'password line is empty',
  INVALID_USERNAME_RANGE: 'invalid_username_range',
  INVALID_PASSWORD_RANGE: 'invalid_password_range',
  USER_CREATION_ERROR: 'user_creation_error',
  PERMISSION_DENIED: 'permission_denied',
  UNKNOWN_ERROR: 'unknown_error',
  USER_ID_ERROR: 'id_not_found',
  ID_ERROR: 'id error',
  USER_DELETE_ERROR: 'deleting_error',
  USER_UPDATE_ERROR: 'updating_error',
  POST_CREATION_ERROR: 'post error',
  BODY_SIZE_ERROR: 'invalid post size',
  EMPTY_ERROR: 'body or header doesn\'t exist',
  FORUM_NOT_FOUND: 'forum not found',

};
class Utility {
  static generateErrorMessage(type, options) {
    options = options || {};
    let error_object = {
      type: type || ErrorTypes.UNKNOWN_ERROR,
      message: 'Something went wrong..'
    };
    switch (type) {
      case ErrorTypes.USERNAME_EMPTY:
      error_object.message = 'please enter your username';
      break;
      case ErrorTypes.INVALID_USERNAME_RANGE:
      error_object.message = 'Invalid min/max value for username, must be >= {min} and <= {max}, your value is: {val}'.replace('{min}', AppConstants.USERNAME_MIN_LENGTH)
      .replace('{max}', AppConstants.USERNAME_MAX_LENGTH);
      break;
      case ErrorTypes.PASSWORD_EMPTY:
      error_object.message = 'please enter your password';
      break;
      case ErrorTypes.INVALID_PASSWORD_RANGE:
      error_object.message = 'please add correct password';
      break;
      case ErrorTypes.USER_CREATION_ERROR:
      error_object.message = 'Failed to create a user.';
      break;
      case ErrorTypes.USER_ID_ERROR:
      error_object.message = 'this id not found.';
      break;
      case ErrorTypes.ID_ERROR:
      error_object.message = 'id not found.';
      break;
      case ErrorTypes.USER_DELETE_ERROR:
      error_object.message = 'this user not removed.';
      break;
      case ErrorTypes.PERMISSION_DENIED:
      error_object.message = 'you must be registered.';
      break;
      case ErrorTypes.BODY_SIZE_ERROR:
      error_object.message = 'posting size error.';
      break;
      case ErrorTypes.EMPTY_ERROR:
      error_object.message = 'body or header doesn\'t exist';
      break;
      case ErrorTypes.FORUM_NOT_FOUND:
      error_object.message = 'forum doesn\'t exist';
      break;
    }
    return error_object;
  }
}
module.exports = Utility;
module.exports.ErrorTypes = ErrorTypes;
