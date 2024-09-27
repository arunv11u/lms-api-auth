import { ErrorCodes, Factory, GenericError } from "../../utils";
import {
	ChangeInstructorPasswordUseCaseImpl,
	ForgotInstructorPasswordUseCaseImpl,
	GetInstructorProfileUseCaseImpl,
	RegisterInstructorUseCaseImpl,
	ResetInstructorPasswordUseCaseImpl,
	SignInInstructorUseCaseImpl,
	SignInInstructorWithGmailUseCaseImpl,
	UploadInstructorProfilePictureUseCaseImpl
} from "../application";
import { InstructorEntityImpl, InstructorObject } from "../domain";
import { InstructorRepositoryImpl } from "../infrastructure";


class InstructorFactory implements Factory {

	private _objects: string[] = [
		"InstructorEntity",
		"InstructorRepository",
		"RegisterInstructorUseCase",
		"SignInInstructorUseCase",
		"SignInInstructorWithGmailUseCase",
		"ForgotInstructorPasswordUseCase",
		"ResetInstructorPasswordUseCase",
		"GetInstructorProfileUseCase",
		"ChangeInstructorPasswordUseCase",
		"UploadInstructorProfilePictureUseCase"
	];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	make(objectName: string): InstructorObject {

		if (objectName === "InstructorEntity")
			return new InstructorEntityImpl();

		if (objectName === "InstructorRepository")
			return new InstructorRepositoryImpl();

		if (objectName === "RegisterInstructorUseCase")
			return new RegisterInstructorUseCaseImpl();

		if (objectName === "SignInInstructorUseCase")
			return new SignInInstructorUseCaseImpl();

		if (objectName === "SignInInstructorWithGmailUseCase")
			return new SignInInstructorWithGmailUseCaseImpl();

		if (objectName === "ForgotInstructorPasswordUseCase")
			return new ForgotInstructorPasswordUseCaseImpl();

		if (objectName === "ResetInstructorPasswordUseCase")
			return new ResetInstructorPasswordUseCaseImpl();

		if (objectName === "GetInstructorProfileUseCase")
			return new GetInstructorProfileUseCaseImpl();

		if (objectName === "ChangeInstructorPasswordUseCase")
			return new ChangeInstructorPasswordUseCaseImpl();

		if (objectName === "UploadInstructorProfilePictureUseCase")
			return new UploadInstructorProfilePictureUseCaseImpl();

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
	InstructorFactory
};