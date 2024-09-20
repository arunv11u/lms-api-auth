import { Controller, Post } from "@arunvaradharajalu/common.decorators";
import { Request, Response, NextFunction } from "express";
import {
	ErrorCodes,
	GenericError,
	getResponseHandler,
	winstonLogger
} from "../../../utils";
import { getStudentFactory } from "../../../global-config";
import {
	ForgotStudentPasswordRequestDTOImpl,
	ForgotStudentPasswordUseCase,
	RegisterStudentRequestDTOImpl,
	RegisterStudentUseCase,
	SignInStudentRequestDTOImpl,
	SignInStudentUseCase,
	SignInStudentWithGmailRequestDTOImpl,
	SignInStudentWithGmailUseCase
} from "../../application";


@Controller("/student")
export class StudentController {

	@Post("/register")
	async register(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("Registering a student");

			if (!request.body.email)
				throw new GenericError({
					code: ErrorCodes.studentEmailRequired,
					error: new Error("Student email is required"),
					errorCode: 400
				});

			if (!request.body.firstName)
				throw new GenericError({
					code: ErrorCodes.studentFirstNameRequired,
					error: new Error("Student first name is required"),
					errorCode: 400
				});

			if (!request.body.lastName)
				throw new GenericError({
					code: ErrorCodes.studentLastNameRequired,
					error: new Error("Student last name is required"),
					errorCode: 400
				});

			if (!request.body.password)
				throw new GenericError({
					code: ErrorCodes.studentPasswordRequired,
					error: new Error("Student password is required"),
					errorCode: 400
				});

			const studentFactory = getStudentFactory();
			const responseHandler = getResponseHandler();

			const registerStudentRequestDTO =
				new RegisterStudentRequestDTOImpl();
			registerStudentRequestDTO.email = request.body.email;
			registerStudentRequestDTO.firstName = request.body.firstName;
			registerStudentRequestDTO.lastName = request.body.lastName;
			registerStudentRequestDTO.password = request.body.password;

			const registerStudentUseCase = studentFactory.make("RegisterStudentUseCase") as RegisterStudentUseCase;
			registerStudentUseCase.registerStudentRequestDTO =
				registerStudentRequestDTO;

			const registerStudentResponseDTO =
				await registerStudentUseCase.execute();

			responseHandler.ok(response, registerStudentResponseDTO);
		} catch (error) {
			winston.error(
				"Error in registering a student:",
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
			winston.info("sign-in-ing as a student");

			if (!request.body.email)
				throw new GenericError({
					code: ErrorCodes.studentEmailRequired,
					error: new Error("Student email is required"),
					errorCode: 400
				});

			if (!request.body.password)
				throw new GenericError({
					code: ErrorCodes.studentPasswordRequired,
					error: new Error("Student password is required"),
					errorCode: 400
				});

			const studentFactory = getStudentFactory();
			const responseHandler = getResponseHandler();

			const signInStudentRequestDTO =
				new SignInStudentRequestDTOImpl();
			signInStudentRequestDTO.email = request.body.email;
			signInStudentRequestDTO.password = request.body.password;

			const signInStudentUseCase = studentFactory.make("SignInStudentUseCase") as SignInStudentUseCase;
			signInStudentUseCase.signInStudentRequestDTO =
				signInStudentRequestDTO;

			const signInStudentResponseDTO =
				await signInStudentUseCase.execute();

			responseHandler.ok(response, signInStudentResponseDTO);
		} catch (error) {
			winston.error(
				"Error in student sign-in:",
				error
			);

			next(error);
		}
	}

	@Post("/sign-in/gmail")
	async signInWithGmail(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("sign-in-ing with gmail as a student");

			if (!request.body.authCode)
				throw new GenericError({
					code: ErrorCodes.googleAuthCodeRequired,
					error: new Error("Google auth code is required"),
					errorCode: 400
				});

			if (!request.body.redirectUri)
				throw new GenericError({
					code: ErrorCodes.googleRedirectUriRequired,
					error: new Error("Google redirect uri is required"),
					errorCode: 400
				});

			const studentFactory = getStudentFactory();
			const responseHandler = getResponseHandler();

			const signInStudentWithGmailRequestDTO =
				new SignInStudentWithGmailRequestDTOImpl();
			signInStudentWithGmailRequestDTO.authCode =
				request.body.authCode;
			signInStudentWithGmailRequestDTO.redirectUri =
				request.body.redirectUri;

			const signInStudentWithGmailUseCase = studentFactory.make("SignInStudentWithGmailUseCase") as SignInStudentWithGmailUseCase;
			signInStudentWithGmailUseCase.signInStudentWithGmailRequestDTO =
				signInStudentWithGmailRequestDTO;

			const signInStudentWithGmailResponseDTO =
				await signInStudentWithGmailUseCase.execute();

			responseHandler.ok(response, signInStudentWithGmailResponseDTO);
		} catch (error) {
			winston.error(
				"Error in student sign-in with gmail:",
				error
			);

			next(error);
		}
	}

	@Post("/forgot-password")
	async forgotPassword(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("Student triggered a forgot password");

			if (!request.body.email)
				throw new GenericError({
					code: ErrorCodes.studentEmailRequired,
					error: new Error("Student email is required"),
					errorCode: 400
				});

			const studentFactory = getStudentFactory();
			const responseHandler = getResponseHandler();

			const forgotStudentPasswordRequestDTO =
				new ForgotStudentPasswordRequestDTOImpl();
			forgotStudentPasswordRequestDTO.email = request.body.email;

			const forgotStudentPasswordUseCase = studentFactory.make("ForgotStudentPasswordUseCase") as ForgotStudentPasswordUseCase;
			forgotStudentPasswordUseCase.forgotStudentPasswordRequestDTO = 
				forgotStudentPasswordRequestDTO;

			await forgotStudentPasswordUseCase.execute();

			responseHandler.ok(response);
		} catch (error) {
			winston.error(
				"Error in sending forgot password email for a student:",
				error
			);

			next(error);
		}
	}

}