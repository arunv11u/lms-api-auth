import jwt from "jsonwebtoken";
import { JWTPayload } from "../../json-web-token";


interface DecodedGoogleOAuthIdTokenResponse {
	email: string;
	firstName: string;
	lastName: string;
}

abstract class JSONWebToken {
	abstract sign(
		data: JWTPayload,
		secret: string
	): Promise<string>;
	abstract sign(
		data: JWTPayload,
		secret: string,
		options: jwt.SignOptions
	): Promise<string>;

	abstract verify(
		token: string,
		secret: string
	): Promise<JWTPayload>;

	abstract decodeGoogleOAuthIdToken(
		idToken: string
	): DecodedGoogleOAuthIdTokenResponse;
}

export {
	DecodedGoogleOAuthIdTokenResponse,
	JSONWebToken
};