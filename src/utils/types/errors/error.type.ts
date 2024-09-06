
export enum ErrorCodes {
	clientError = "CLIENT_ERROR",
	unauthorized = "UNAUTHRORIZED",
	paymentRequired = "PAYMENT_REQUIRED",
	forbidden = "FORBIDDEN",
	notFound = "NOT_FOUND",
	conflict = "CONFLICT",
	tooManyRequests = "TOO_MANY_REQUESTS",
	firebaseAppTokenConnection = "FIREBASE_APP_TOKEN_CONNECTION",
	invalidFactoryObject = "INV_FACTORY_OBJ",
	invalidInput = "INV_INPUT",
	noUseCase = "NO_USE_CASE",
	invalidEnvironment = "INV_ENVIRONMENT",
	invalidOrigin = "INV_ORIGIN",
	userAlreadyExists = "USR_ALREADY_EXISTS",
	passwordDoesnotMatch = "PASSWORD_DOES_NOT_MATCH",
	userNotFound = "USR_NOT_EXISTS",
	firebaseInvalidAppToken = "FIREBASE_INVALID_APP_TOKEN",
	invalidCredentials = "INVALID_CREDENTIALS",
	invalidPassword = "INV_PASSWORD",
	invalidRefreshToken = "INVALID_REFRESH_TOKEN",
	internalError = "INTERNAL_ERROR"
}

export interface FormattedError {
	errors: ErrorObject[];
}


export interface ErrorObject {
	code: string;
	message: string;
	field?: string;
}


export interface GenericErrorObject {
	code: ErrorCodes;
	error: Error;
	errorCode: number;
}
