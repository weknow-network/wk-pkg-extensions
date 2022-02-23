/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-extend-native */
/* eslint-disable @typescript-eslint/naming-convention */

// credits: https://www.itsrainingmani.dev/blog/string-prototype-extension/

declare global {
  interface String {
    /**
     * replace text to camelCase
     *
     * @example 'HellowWorld' -> 'hellowWorld'
     * @example 'hellow-World' -> 'hellowWorld'
     * @example 'Hellow world' -> 'hellowWorld'
     */
    toCamel(): string;
    /**
     * replace text to dash-separator
     *
     * @example 'HellowWorld' -> 'hellow-world'
     * @example 'hellow_World' -> 'hellow-World'
     */
    toDash(): string;
  }
}

export const extendStringPrototype = () => {
  if (!String.prototype.toCamel) {
    String.prototype.toCamel = function (): string {
      // [^\da-zA-Z] = not digit or a-Z, follow by a-Z or capital letter
      const result = this.replace(
        /[^\da-zA-Z]([a-zA-Z])|(\b[A-Z])/g,
        (match, args) => args?.toUpperCase() ?? match?.toLowerCase() ?? ""
      );
      return result;
    };
  }

  if (!String.prototype.toDash) {
    String.prototype.toDash = function (): string {
      if (!this) return "";

      const [head] = this;
      const tail = this.slice(1);

      const start = head.replace(/([a-zA-Z])/g, (subStr, _) =>
        subStr?.toLowerCase()
      );
      const end = tail.replace(
        /[^\da-zA-Z]([a-zA-Z])|\B([A-Z])/g,
        (subStr, _) => {
          return subStr.startsWith("-")
            ? subStr?.toLowerCase().trim()
            : `-${subStr?.toLowerCase().trim()}`;
        }
      );

      const result = `${start}${end}`;
      return result;
    };
  }
};
