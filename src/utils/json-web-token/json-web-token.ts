import jwt from "jsonwebtoken";
import { GenericError } from "../errors";
import {
	DecodedGoogleOAuthIdTokenResponse,
	ErrorCodes,
	JSONWebToken
} from "../types";
import { JWTPayload } from "./jwt-payload";



export class JSONWebTokenImpl implements JSONWebToken {

	async sign(
		data: JWTPayload,
		secret: string,
		options?: jwt.SignOptions
	): Promise<string> {
		const token = await new Promise<string>((resolve, reject) => {

			let jwtSignoptions = {};
			if (options) jwtSignoptions = options;

			jwt.sign(data, secret, jwtSignoptions,
				(error: Error | null, encoded: string | undefined) => {
					if (error) return reject(
						new GenericError({
							code: ErrorCodes.internalError,
							error: error,
							errorCode: 500
						}));

					if (!encoded) throw new GenericError({
						code: ErrorCodes.internalError,
						error: new Error("Something went wrong while generating json web token"),
						errorCode: 500
					});

					resolve(encoded);
				});
		});

		return token;
	}

	decodeGoogleOAuthIdToken(
		idToken: string
	): DecodedGoogleOAuthIdTokenResponse {
		const decoded = jwt.decode(idToken) as
			{ email: string, given_name: string, family_name: string };

		const { email, given_name, family_name } = decoded;

		return {
			email,
			firstName: given_name,
			lastName: family_name
		};
	}
}