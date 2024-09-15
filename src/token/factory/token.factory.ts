import { ErrorCodes, Factory, GenericError } from "../../utils";
import { TokenObject } from "../domain";
import { TokenRepositoryImpl } from "../infrastructure";


class TokenFactory implements Factory {

	private _objects: string[] = [
		"TokenRepository"
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	make(objectName: string): TokenObject {

		if (objectName === "TokenRepository")
			return new TokenRepositoryImpl();

		throw new GenericError({
			code: ErrorCodes.invalidFactoryObject,
			error: new Error("Requested object is invalid"),
			errorCode: 500
		});
	}

	getAll(): string[] {
		return this._objects;
	}
}

export {
	TokenFactory
};