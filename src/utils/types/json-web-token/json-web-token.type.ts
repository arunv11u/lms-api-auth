import jwt from "jsonwebtoken";
import { JWTPayload } from "../../json-web-token";


export abstract class JSONWebToken {
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
}