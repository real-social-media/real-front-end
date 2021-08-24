import * as Yup from 'yup'
import path from 'ramda/src/path'
import trim from 'ramda/src/trim'
import compose from 'ramda/src/compose'
import replace from 'ramda/src/replace'
import toLower from 'ramda/src/toLower'
import pathOr from 'ramda/src/pathOr'
import debounce from 'debounce-async'
import { Platform } from 'react-native'
import API, { graphqlOperation } from '@aws-amplify/api'
import * as usersQueries from 'store/ducks/users/queries'

/**
 * Constants
 */
export const ERRORS = {
  dateOfBirthMonth: 'Month must be selected',
  dateOfBirthDay: 'Date must be selected',
  dateOfBirthYear: 'Year must be selected',
  gender: 'Gender must be selected',
  paymentTicker: 'A coin must be selected',
  fullName: 'Name must be entered',
  displayName: 'Name must be entered',
  bio: 'Bio must be filled',
  matchAgeRangeMin: 'Minimum age must be a selected',
  matchAgeRangeMax: 'Maximum age must be a selected',
  matchLocationRadius: 'Radius must be a selected',
  matchGendersError: 'Gender must be a selected',
  onlyNumbers: 'must only contain numbers',
  noWhitespace: 'no whitespace',
  height: 'Height must be selected',
  minHeight: 'Height must be greater than 0',
  maxHeight: 'Height must be less than 10\'',
  minPayment: 'Payment must be greater than 0',
  maxPayment: 'Payment must be less than 100\'',
  usernameReserve: 'Username is reserved',
}

export const MIN_HEIGHT = 1
export const MAX_HEIGHT = 84
export const MIN_PAYMENT = 0
export const MAX_PAYMENT = 100

/**
 * Validators
 */
export async function usernameStatusRequest(username) {
  const response = await API.graphql(graphqlOperation(usersQueries.usernameStatus, { username }))
  return path(['data', 'usernameStatus'], response)
}

export const remoteUsernameValidation = () => {
  function validate(value) {
    return new Promise((resolve) => {
      usernameStatusRequest(value)
        .then((usernameStatus) => resolve(usernameStatus === 'AVAILABLE'))
        .catch(() => resolve(true))
    })
  }

  const debouncedValidation = debounce(validate, 300, { leading: true })
  const ignoreError = () => {}

  return function (value) {
    return debouncedValidation(value).catch(ignoreError)
  }
}

export const phoneOrEmail = Yup.string()
  .min(3)
  .max(50)
  .trim()
  .required()

export const username = Yup.string()
  .min(3)
  .max(50)
  .matches(/^[a-zA-Z0-9_.]*$/, 'username must only contain letters & numbers')
  .trim()
  .required()

export const uniqUsername = username
  .test('usernameReserve', ERRORS.usernameReserve, remoteUsernameValidation())

export const email = Yup.string()
  .matches(/^\S*$/, ERRORS.noWhitespace)
  .email()
  .min(3)
  .max(50)
  .trim()
  .required()

export const phone = Yup.string()
  .matches(/^[0-9]*$/gm, ERRORS.onlyNumbers)
  .min(3)
  .max(50)
  .trim()


export const password = Yup.string()
  .min(8)
  .max(50)
  .trim()
  .required()

export const confirmationCode = Yup.string()
  .length(6)
  .matches(/^[0-9]*$/, ERRORS.onlyNumbers)
  .matches(/^\S*$/, ERRORS.noWhitespace)
  .trim()
  .required()

export const dateOfBirthMonth = Yup.number()
  .typeError(ERRORS.dateOfBirthMonth)
  .positive(ERRORS.dateOfBirthMonth)
  .required(ERRORS.dateOfBirthMonth)

export const dateOfBirthDay = Yup.number()
  .typeError(ERRORS.dateOfBirthDay)
  .positive(ERRORS.dateOfBirthDay)
  .required(ERRORS.dateOfBirthDay)

export const dateOfBirthYear = Yup.number()
  .typeError(ERRORS.dateOfBirthYear)
  .positive(ERRORS.dateOfBirthYear)
  .required(ERRORS.dateOfBirthYear)

export const gender = Yup.string()
  .typeError(ERRORS.gender)
  .required(ERRORS.gender)

export const fullName = Yup.string()
  .typeError(ERRORS.fullName)
  .nullable()

export const displayName = Yup.string()
  .typeError(ERRORS.displayName)
  .required(ERRORS.displayName)

export const bio = Yup.string()
  .typeError(ERRORS.bio)
  .nullable()

export const matchAgeRangeMin = Yup.number()
  .typeError(ERRORS.matchAgeRangeMin)
  .positive(ERRORS.matchAgeRangeMin)
  .required(ERRORS.matchAgeRangeMin)

export const matchAgeRangeMax = Yup.number()
  .typeError(ERRORS.matchAgeRangeMax)
  .positive(ERRORS.matchAgeRangeMax)
  .required(ERRORS.matchAgeRangeMax)

export const matchLocationRadius = Yup.number()
  .typeError(ERRORS.matchLocationRadius)
  .positive(ERRORS.matchLocationRadius)
  .required(ERRORS.matchLocationRadius)

export const matchGenders = Yup.string()
  .typeError(ERRORS.matchGendersError)
  .required(ERRORS.matchGendersError)

export const height = Yup.number()
  .typeError(ERRORS.height)
  .min(MIN_HEIGHT, ERRORS.minHeight)
  .max(MAX_HEIGHT, ERRORS.maxHeight)
  .required(ERRORS.height)

export const payment = Yup.number()
  .min(MIN_PAYMENT, ERRORS.minPayment)
  .max(MAX_PAYMENT, ERRORS.maxPayment)
  .nullable()

export const paymentTicker = Yup.string()
  .nullable()

export const promocode = Yup.string()
  .lowercase()
  .trim()
  .required()

/**
 * Selectors
 */
const onlyNumbers = replace(/[^+0-9]/g, '')
export const getPhone = compose(onlyNumbers, trim, toLower, pathOr('', ['phone']))
export const getPhoneNumber = compose(onlyNumbers, trim, toLower, pathOr('', ['phoneNumber']))
export const getCountryCode = compose(onlyNumbers, trim, toLower, pathOr('+1', ['countryCode']))
export const getEmail = compose(trim, toLower, pathOr('', ['email']))
export const getUsername = compose(trim, toLower, pathOr('', ['username']))
export const getFullName = compose(trim, pathOr('', ['fullName']))
export const getBio = compose(trim, pathOr('', ['bio']))
export const getPassword = compose(trim, pathOr('', ['password']))
export const getConfirmationCode = compose(onlyNumbers, trim, toLower, pathOr('', ['confirmationCode']))
export const getPromocode = compose(trim, toLower, pathOr('', ['code']))

/**
 * Input Props
 */
export const getInputTypeProps = (type) => {
  switch (type) {
    case 'email':
      return {
        accessibilityLabel: 'email',
        keyboardType: 'email-address',
        textContentType: 'emailAddress',
        autoCompleteType: 'email',
      }
    case 'confirmationCode':
      return {
        accessibilityLabel: 'confirmationCode',
        keyboardType: 'number-pad',
        textContentType: 'oneTimeCode',
        autoCompleteType: 'off',
        maxLength: 6,
      }
    case 'payment':
      return {
        accessibilityLabel: 'payment',
        keyboardType: 'decimal-pad',
        autoCompleteType: 'off',
      }
    case 'promocode':
      return {
        accessibilityLabel: 'promocode',
        keyboardType: 'default',
        textContentType: 'oneTimeCode',
      }
    case 'password':
      return {
        accessibilityLabel: 'password',
        secureTextEntry: true,
        keyboardType: 'default',
        textContentType: 'password',
        autoCompleteType: 'password',
      }
    case 'username':
      return {
        accessibilityLabel: 'username',
        keyboardType: Platform.OS === 'android' ? 'default' : 'ascii-capable',
        textContentType: 'username',
        autoCompleteType: 'username',
      }
    case 'phone':
      return {
        accessibilityLabel: 'phone',
        keyboardType: 'number-pad',
        textContentType: 'telephoneNumber',
        autoCompleteType: 'tel',
      }
    default:
      return {}
  }
}
