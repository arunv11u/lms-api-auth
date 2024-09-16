
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
	firebaseInvalidAppToken = "FIREBASE_INVALID_APP_TOKEN",
	invalidCredentials = "INVALID_CREDENTIALS",
	invalidPassword = "INV_PASSWORD",
	invalidRefreshToken = "INVALID_REFRESH_TOKEN",
	internalError = "INTERNAL_ERROR",
	postgresqlRepositoryDoesNotExist = "POSTGRESQL_REPOSITORY_DOES_NOT_EXIST",
	kafkaProducerMessageNotAvailable = "KAFKA_PRODUCER_MESSAGE_NOT_AVAILABLE",
	studentEmailRequired = "STUDENT_EMAIL_REQUIRED",
	studentFirstNameRequired = "STUDENT_FIRST_NAME_REQUIRED",
	studentLastNameRequired = "STUDENT_LAST_NAME_REQUIRED",
	studentPasswordRequired = "STUDENT_PASSWORD_REQUIRED",
	studentNotFound = "STUDENT_NOT_FOUND",
	studentAlreadyExists = "STUDENT_ALREADY_EXISTS",
	studentPasswordNotExists = "STUDENT_PASSWORD_NOT_EXISTS",
	studentMaySignupWithGmail = "STUDENT_MAY_SIGNUP_WITH_GMAIL",
	googleAuthCodeRequired = "GOOGLE_AUTH_CODE_REQUIRED",
	googleRedirectUriRequired = "GOOGLE_REDIRECT_URI_REQUIRED"
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
