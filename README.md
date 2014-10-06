## Introduction

UK number plates are available in a set range of formats. This short Node JS validation script will take a supplied string and return to you a JSON object containing a correct/road legal formatted version of the registration plus some other useful information where possible.

## Installation

```                                                       
  npm install uk-numberplates
```

## Usage

Very simple - there's a test.js file included with a practical example, but the short of it is that you include the uk-numberplates.js module, then feed it a string you'd like to be parsed/validated, and a callback function. The callback function receivs two values, an error flag (false if all is OK and the string was parsed as a valid registration mark) and a JSON data object containing the correctly formatted number plate along with any additional info.

## Response

If the error value returned is false, then the string parsed was determined to be a valid registration. If anything is else is returned, this is a hint as to why the string is not valid.
1 = UNKNOWN FORMAT - Whatever this string is, it doesn't approach a legal UK number plate format.
2 = INVALID CHARS - UK number plates are characters A-Z, numbers 0-9 and a space; nothing else.
3 = ASTERISK - the string contained an asterisk.
4 = Q IN REG (NOT PREFIX) - the letter Q is only issued to a limited subset of 'prefix' number plates. This string contained a Q but wasn't a match to the prefix format.
5 = I BUT NOT IRISH - The letter I is reserved for use on Irish number plates, this string contained an I, but wasn't Irish in format.
6 = Z BUT NOT IRISH OR NEW STYLE - The letter Z is reserved for use on Irish and new style (post 2000) number plates. This string contained Z but matched neither format.
7 = NEW STYLE Z IN FIRST 2 CHAR - New style registration format, but the letter Z was detected in the first two characters of the plate. Z is only valid in the last three.
8 = INVALID NUMBER (LEADING ZERO) - UK number plates do not have a leading zero (the exception being the new style format - but this string must not have matched that format).

The JSON data object returned looks something like this :

```
{ plate: 'A123 STE',
  irish: false,
  prefix: 'A',
  suffix: 'STE',
  number: '123',
  year_of_issue: '1983',
  year_of_issue_expiry: '1984',
  month_of_issue: '08',
  month_of_issue_expiry: '08' }
```

The plate value is the correctly formatted registration - in this case the string fed in could be mapped to A123 STE.
irish is a true or false value that identifies if the registration is Irish in origin.
prefix, suffix and number represent the component parts of this registration. A being the prefix letter, STE being the suffix, 123 being the numbers. In the case of suffix format reg - such as STE 123A - these values would be the same, but of course 'prefix' effectively means suffix, whilst 'suffix' effectively means index, as the registration is 'flipped'. With a dateless registration that carries no prefix, prefix would be false and suffix would also effectively mean index.
year_of_issue tells you what year this registration would first have been available - for as yet unreleased plates the future release date will be calculated (e.g AB98 STE = 2048).
month_of_issue tells you the month of the year this registration would have first been available.
year_of_issue_expiry and month_of_issue_expiry tell you when the following sequence of number plates was released that suprceeded reg of this type (e.g A reg came out in 1983, B reg followed in 1984).
These issue dates are NOT always available. Dateless number plates have no identifiers to give their age. In this case a value of 'DAT' signifying 'dateless' will be returned.
