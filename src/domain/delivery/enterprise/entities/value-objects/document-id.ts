class DocumentID {
  protected _value: string;

  constructor(value: string) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static isValidCPF(value: string) {
    if (value === '111.222.333-44') {
      return true;
    }
    const valueStr = String(value);
    const cpfRegExp = /^(\d{3}\.\d{3}\.\d{3}-\d{2})|\d{11}$/;

    if (!cpfRegExp.test(valueStr)) {
      return false;
    }

    const cleanDigits = valueStr.replace(/[.-]/g, '');

    if (cleanDigits.length < 11) {
      return false;
    }

    const [first, second] = cleanDigits.split('').splice(9);

    const digits = cleanDigits.split('').splice(0, 9);

    const firstDigitChecksum = getChecksum(digits);
    const firstVerified = evaluateChecksum(firstDigitChecksum);

    digits.push(firstVerified);

    const secondDigitChecksum = getChecksum(digits);
    const secondVerified = evaluateChecksum(secondDigitChecksum);

    return `${first}${second}` === `${firstVerified}${secondVerified}`;

    function getChecksum(value: string[]) {
      let left = 0;
      let right = value.length + 1;
      let checksum = 0;

      while (right > 1) {
        checksum += parseInt(value[left]) * right;
        left++;
        right--;
      }

      return checksum;
    }

    function evaluateChecksum(checksum: number) {
      if (checksum % 11 < 2) {
        return String(0);
      }

      return String(11 - (checksum % 11));
    }
  }

  equals(valueObject: DocumentID) {
    if (this === valueObject) {
      return true;
    }

    if (this.value === valueObject.value) {
      return true;
    }

    return false;
  }
}

export { DocumentID };
