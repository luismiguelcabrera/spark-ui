export type Country = {
  /** ISO 3166-1 alpha-2 code (e.g., "US") */
  code: string;
  /** English country name */
  name: string;
  /** International dial code (e.g., "+1") */
  dialCode: string;
  /** Input mask where 9 = any digit */
  mask: string;
  /** Emoji flag */
  flag: string;
};

export const countries: Country[] = [
  { code: "US", name: "United States", dialCode: "+1", mask: "(999) 999-9999", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", mask: "9999 999999", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "CA", name: "Canada", dialCode: "+1", mask: "(999) 999-9999", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "AU", name: "Australia", dialCode: "+61", mask: "999 999 999", flag: "\u{1F1E6}\u{1F1FA}" },
  { code: "DE", name: "Germany", dialCode: "+49", mask: "9999 9999999", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "FR", name: "France", dialCode: "+33", mask: "9 99 99 99 99", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "IT", name: "Italy", dialCode: "+39", mask: "999 999 9999", flag: "\u{1F1EE}\u{1F1F9}" },
  { code: "ES", name: "Spain", dialCode: "+34", mask: "999 999 999", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "BR", name: "Brazil", dialCode: "+55", mask: "(99) 99999-9999", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "MX", name: "Mexico", dialCode: "+52", mask: "99 9999 9999", flag: "\u{1F1F2}\u{1F1FD}" },
  { code: "IN", name: "India", dialCode: "+91", mask: "99999 99999", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "CN", name: "China", dialCode: "+86", mask: "999 9999 9999", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "JP", name: "Japan", dialCode: "+81", mask: "99 9999 9999", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "KR", name: "South Korea", dialCode: "+82", mask: "99 9999 9999", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "RU", name: "Russia", dialCode: "+7", mask: "(999) 999-99-99", flag: "\u{1F1F7}\u{1F1FA}" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", mask: "99 999 9999", flag: "\u{1F1F8}\u{1F1E6}" },
  { code: "AE", name: "UAE", dialCode: "+971", mask: "99 999 9999", flag: "\u{1F1E6}\u{1F1EA}" },
  { code: "ZA", name: "South Africa", dialCode: "+27", mask: "99 999 9999", flag: "\u{1F1FF}\u{1F1E6}" },
  { code: "NG", name: "Nigeria", dialCode: "+234", mask: "999 999 9999", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "EG", name: "Egypt", dialCode: "+20", mask: "99 9999 9999", flag: "\u{1F1EA}\u{1F1EC}" },
  { code: "AR", name: "Argentina", dialCode: "+54", mask: "99 9999-9999", flag: "\u{1F1E6}\u{1F1F7}" },
  { code: "CO", name: "Colombia", dialCode: "+57", mask: "999 999 9999", flag: "\u{1F1E8}\u{1F1F4}" },
  { code: "CL", name: "Chile", dialCode: "+56", mask: "9 9999 9999", flag: "\u{1F1E8}\u{1F1F1}" },
  { code: "PL", name: "Poland", dialCode: "+48", mask: "999 999 999", flag: "\u{1F1F5}\u{1F1F1}" },
  { code: "NL", name: "Netherlands", dialCode: "+31", mask: "9 99999999", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "SE", name: "Sweden", dialCode: "+46", mask: "99 999 99 99", flag: "\u{1F1F8}\u{1F1EA}" },
  { code: "NO", name: "Norway", dialCode: "+47", mask: "999 99 999", flag: "\u{1F1F3}\u{1F1F4}" },
  { code: "PT", name: "Portugal", dialCode: "+351", mask: "999 999 999", flag: "\u{1F1F5}\u{1F1F9}" },
  { code: "TR", name: "Turkey", dialCode: "+90", mask: "(999) 999 9999", flag: "\u{1F1F9}\u{1F1F7}" },
  { code: "IL", name: "Israel", dialCode: "+972", mask: "99 999 9999", flag: "\u{1F1EE}\u{1F1F1}" },
];
