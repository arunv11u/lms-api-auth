/* eslint-disable max-classes-per-file */

enum UserTypes {
	student = "STUDENT",
	instructor = "INSTRUCTOR"
}

class JWTPayload {
	user: string;
	type: UserTypes;
	sessionId: string;
}

export {
	UserTypes,
	JWTPayload
};