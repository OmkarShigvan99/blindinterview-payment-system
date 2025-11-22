import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { z } from "zod";

countries.registerLocale(en);

// Get array of ISO2 country codes
const countryCodesISO2 = Object.keys(countries.getAlpha2Codes()) as [
    string,
    ...string[]
];

export const countryCode2Schema = z.enum(countryCodesISO2, {
    required_error: "Country is required",
    invalid_type_error: `Country must be valid ${countryCodesISO2}`,
}); // Zod enum

export type CountryCode2 = z.infer<typeof countryCode2Schema>;

export const getCountryNumericCode = (countryCode2: CountryCode2) =>
    countries.alpha2ToNumeric(countryCode2);

export const getCountryName = (countryCode2: CountryCode2) =>
    countries.getName(countryCode2, "en");
