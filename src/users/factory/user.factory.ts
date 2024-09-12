import { ErrorCodes, Factory, GenericError } from "../../utils";




class UserFactory implements Factory {

	private _objects: string[] = [
		"UserEntity"
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	make(objectName: string) {

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
	UserFactory
};