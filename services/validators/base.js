const Types = {
  STRING: 'string',
};

class BaseValidator {

  constructor() {
    this.handlers = {};
    this.handlers[Types.STRING] = this._isString;
  }

  validate(str, type) {
    if (!this.handlers[type]) {
      return false;
    }
    return this.handlers[type](str);
  }
  _isString(str) {
    if(!str)
    return false;
    return(typeof(str) === "string")
  }
  _isSymbol(str){
    if(!str)
    return false;
    let symRegExp = AppConstants.SYMBOL_REG_EXP;
    return symRegExp.test(str);
  }
}

module.exports = BaseValidator;
module.exports.Types = Types;
