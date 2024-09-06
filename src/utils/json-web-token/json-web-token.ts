import jwt from "jsonwebtoken";
import { GenericError } from "../errors";
import {
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

	async verify(
		token: string,
		secret: string
	): Promise<JWTPayload> {

		const payload = await new Promise<JWTPayload>((resolve, reject) => {
			jwt.verify(token, secret, (
				error: jwt.VerifyErrors | null,
				decoded: string | jwt.JwtPayload | undefined
			) => {
				if (error) return reject(new GenericError({
					code: ErrorCodes.internalError,
					error: error,
					errorCode: 500
				}));

				if (!decoded) throw new GenericError({
					code: ErrorCodes.internalError,
					error: new Error("Something went wrong while verifying json web token"),
					errorCode: 500
				});

				const decodedPayload = decoded as jwt.JwtPayload;

				const payload = new JWTPayload();
				payload.user = decodedPayload.user;
				payload.sessionId = decodedPayload.sessionId;

				resolve(payload);
			});
		});

		return payload;
	}
}