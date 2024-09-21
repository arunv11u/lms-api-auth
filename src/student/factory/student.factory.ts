import { ErrorCodes, Factory, GenericError } from "../../utils";
import {
	ForgotStudentPasswordUseCaseImpl,
	RegisterStudentUseCaseImpl,
	ResetStudentPasswordUseCaseImpl,
	SignInStudentUseCaseImpl,
	SignInStudentWithGmailUseCaseImpl
} from "../application";
import { StudentEntityImpl, StudentObject } from "../domain";
import { StudentRepositoryImpl } from "../infrastructure";


class StudentFactory implements Factory {

	private _objects: string[] = [
		"StudentEntity",
		"StudentRepository",
		"RegisterStudentUseCase",
		"SignInStudentUseCase",
		"SignInStudentWithGmailUseCase",
		"ForgotStudentPasswordUseCase",
		"ResetStudentPasswordUseCase"
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	make(objectName: string): StudentObject {

		if (objectName === "StudentEntity")
			return new StudentEntityImpl();

		if (objectName === "StudentRepository")
			return new StudentRepositoryImpl();

		if (objectName === "RegisterStudentUseCase")
			return new RegisterStudentUseCaseImpl();

		if (objectName === "SignInStudentUseCase")
			return new SignInStudentUseCaseImpl();

		if (objectName === "SignInStudentWithGmailUseCase")
			return new SignInStudentWithGmailUseCaseImpl();

		if (objectName === "ForgotStudentPasswordUseCase")
			return new ForgotStudentPasswordUseCaseImpl();

		if (objectName === "ResetStudentPasswordUseCase")
			return new ResetStudentPasswordUseCaseImpl();

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
	StudentFactory
};