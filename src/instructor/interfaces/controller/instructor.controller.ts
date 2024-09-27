/* eslint-disable max-lines */
import { Controller, Post } from "@arunvaradharajalu/common.decorators";
import { Request, Response, NextFunction } from "express";
import {
	ErrorCodes,
	GenericError,
	getResponseHandler,
	winstonLogger
} from "../../../utils";
import {
	RegisterInstructorRequestDTOImpl,
	RegisterInstructorUseCase,
	SignInInstructorRequestDTOImpl,
	SignInInstructorUseCase
} from "../../application";
import { getInstructorFactory } from "../../../global-config";



@Controller("/instructor")
export class InstructorController {

	@Post("/register")
	async register(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("Registering a instructor");

			if (!request.body.email)
				throw new GenericError({
					code: ErrorCodes.instructorEmailRequired,
					error: new Error("Instructor email is required"),
					errorCode: 400
				});

			if (!request.body.firstName)
				throw new GenericError({
					code: ErrorCodes.instructorFirstNameRequired,
					error: new Error("Instructor first name is required"),
					errorCode: 400
				});

			if (!request.body.lastName)
				throw new GenericError({
					code: ErrorCodes.instructorLastNameRequired,
					error: new Error("Instructor last name is required"),
					errorCode: 400
				});

			if (!request.body.password)
				throw new GenericError({
					code: ErrorCodes.instructorPasswordRequired,
					error: new Error("Instructor password is required"),
					errorCode: 400
				});

			const instructorFactory = getInstructorFactory();
			const responseHandler = getResponseHandler();

			const registerInstructorRequestDTO =
				new RegisterInstructorRequestDTOImpl();
			registerInstructorRequestDTO.email = request.body.email;
			registerInstructorRequestDTO.firstName = request.body.firstName;
			registerInstructorRequestDTO.lastName = request.body.lastName;
			registerInstructorRequestDTO.password = request.body.password;

			const registerInstructorUseCase = instructorFactory.make("RegisterInstructorUseCase") as RegisterInstructorUseCase;
			registerInstructorUseCase.registerInstructorRequestDTO =
				registerInstructorRequestDTO;

			const registerInstructorResponseDTO =
				await registerInstructorUseCase.execute();

			responseHandler.ok(response, registerInstructorResponseDTO);
		} catch (error) {
			winston.error(
				"Error in registering a instructor:",
				error
			);

			next(error);
		}
	}

	@Post("/sign-in")
	async signIn(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("sign-in-ing as a instructor");

			if (!request.body.email)
				throw new GenericError({
					code: ErrorCodes.instructorEmailRequired,
					error: new Error("Instructor email is required"),
					errorCode: 400
				});

			if (!request.body.password)
				throw new GenericError({
					code: ErrorCodes.instructorPasswordRequired,
					error: new Error("Instructor password is required"),
					errorCode: 400
				});

			const instructorFactory = getInstructorFactory();
			const responseHandler = getResponseHandler();

			const signInInstructorRequestDTO =
				new SignInInstructorRequestDTOImpl();
			signInInstructorRequestDTO.email = request.body.email;
			signInInstructorRequestDTO.password = request.body.password;

			const signInInstructorUseCase = instructorFactory.make("SignInInstructorUseCase") as SignInInstructorUseCase;
			signInInstructorUseCase.signInInstructorRequestDTO =
				signInInstructorRequestDTO;

			const signInInstructorResponseDTO =
				await signInInstructorUseCase.execute();

			responseHandler.ok(response, signInInstructorResponseDTO);
		} catch (error) {
			winston.error(
				"Error in instructor sign-in:",
				error
			);

			next(error);
		}
	}
}