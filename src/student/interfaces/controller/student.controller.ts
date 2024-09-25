/* eslint-disable max-lines */
import { Controller, Get, Post } from "@arunvaradharajalu/common.decorators";
import { Request, Response, NextFunction } from "express";
import {
	ErrorCodes,
	GenericError,
	getResponseHandler,
	winstonLogger
} from "../../../utils";
import { authorizationTokenName, getStudentFactory } from "../../../global-config";
import {
	ChangeStudentPasswordRequestDTOImpl,
	ChangeStudentPasswordUseCase,
	ForgotStudentPasswordRequestDTOImpl,
	ForgotStudentPasswordUseCase,
	GetStudentProfileRequestDTOImpl,
	GetStudentProfileUseCase,
	RegisterStudentRequestDTOImpl,
	RegisterStudentUseCase,
	ResetStudentPasswordRequestDTOImpl,
	ResetStudentPasswordUseCase,
	SignInStudentRequestDTOImpl,
	SignInStudentUseCase,
	SignInStudentWithGmailRequestDTOImpl,
	SignInStudentWithGmailUseCase,
	UploadStudentProfilePictureRequestDTOImpl,
	UploadStudentProfilePictureUseCase
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

	@Post("/reset-password")
	async resetPassword(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("Student trting to reset a password");

			if (!request.body.email)
				throw new GenericError({
					code: ErrorCodes.studentEmailRequired,
					error: new Error("Student email is required"),
					errorCode: 400
				});

			if (!request.body.verificationCode)
				throw new GenericError({
					code: ErrorCodes.studentEmailRequired,
					error: new Error("Verification Code is required"),
					errorCode: 400
				});

			if (!request.body.password)
				throw new GenericError({
					code: ErrorCodes.studentEmailRequired,
					error: new Error("Password is required"),
					errorCode: 400
				});

			const studentFactory = getStudentFactory();
			const responseHandler = getResponseHandler();

			const resetStudentPasswordRequestDTO =
				new ResetStudentPasswordRequestDTOImpl();
			resetStudentPasswordRequestDTO.email = request.body.email;
			resetStudentPasswordRequestDTO.password = request.body.password;
			resetStudentPasswordRequestDTO.verificationCode =
				request.body.verificationCode;

			const resetStudentPasswordUseCase = studentFactory.make("ResetStudentPasswordUseCase") as ResetStudentPasswordUseCase;
			resetStudentPasswordUseCase.resetStudentPasswordRequestDTO =
				resetStudentPasswordRequestDTO;

			await resetStudentPasswordUseCase.execute();

			responseHandler.ok(response);
		} catch (error) {
			winston.error(
				"Error in resetting password for a student:",
				error
			);

			next(error);
		}
	}

	@Get("/")
	async getStudentProfile(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("Retrieving student profile");

			const authorizationToken = request.header(authorizationTokenName);
			if (!authorizationToken)
				throw new GenericError({
					code: ErrorCodes.invalidAuthorizationToken,
					error: new Error("Invalid authorization token"),
					errorCode: 400
				});

			const studentFactory = getStudentFactory();
			const responseHandler = getResponseHandler();

			const getStudentProfileRequestDTO =
				new GetStudentProfileRequestDTOImpl();
			getStudentProfileRequestDTO.authorizationToken = authorizationToken;

			const getStudentProfileUseCase = studentFactory.make("GetStudentProfileUseCase") as GetStudentProfileUseCase;
			getStudentProfileUseCase.getStudentProfileRequestDTO =
				getStudentProfileRequestDTO;

			const getStudentProfileResponseDTO = await getStudentProfileUseCase
				.execute();

			responseHandler.ok(response, getStudentProfileResponseDTO);
		} catch (error) {
			winston.error(
				"Error in retrieving student profile:",
				error
			);

			next(error);
		}
	}

	@Post("/change-password")
	async changePassword(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("Changing student password");

			const authorizationToken = request.header(authorizationTokenName);
			if (!authorizationToken)
				throw new GenericError({
					code: ErrorCodes.invalidAuthorizationToken,
					error: new Error("Invalid authorization token"),
					errorCode: 400
				});

			if (!request.body.password)
				throw new GenericError({
					code: ErrorCodes.studentPasswordRequired,
					error: new Error("Student password required"),
					errorCode: 400
				});

			const studentFactory = getStudentFactory();
			const responseHandler = getResponseHandler();

			const changeStudentPasswordRequestDTO =
				new ChangeStudentPasswordRequestDTOImpl();
			changeStudentPasswordRequestDTO.authorizationToken =
				authorizationToken;
			changeStudentPasswordRequestDTO.password = request.body.password;

			const changeStudentPasswordUseCase = studentFactory.make("ChangeStudentPasswordUseCase") as ChangeStudentPasswordUseCase;
			changeStudentPasswordUseCase.changeStudentPasswordRequestDTO =
				changeStudentPasswordRequestDTO;

			await changeStudentPasswordUseCase
				.execute();

			responseHandler.ok(response);
		} catch (error) {
			winston.error(
				"Error in changing student password:",
				error
			);

			next(error);
		}
	}

	@Post("/upload-student-profile-picture")
	async uploadStudentProfilePicture(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("Uploading student profile picture");

			const authorizationToken = request.header(authorizationTokenName);
			if (!authorizationToken)
				throw new GenericError({
					code: ErrorCodes.invalidAuthorizationToken,
					error: new Error("Invalid authorization token"),
					errorCode: 400
				});

			if (!request.body.mimeType)
				throw new GenericError({
					code: ErrorCodes.studentProfilePictureMimeTypeRequired,
					error: new Error("Mime type required"),
					errorCode: 400
				});

			const studentFactory = getStudentFactory();
			const responseHandler = getResponseHandler();

			const uploadStudentProfilePictureRequestDTO =
				new UploadStudentProfilePictureRequestDTOImpl();
			uploadStudentProfilePictureRequestDTO.authorizationToken =
				authorizationToken;
			uploadStudentProfilePictureRequestDTO.mimeType =
				request.body.mimeType;

			const uploadStudentProfilePictureUseCase = studentFactory.make("UploadStudentProfilePictureUseCase") as UploadStudentProfilePictureUseCase;
			uploadStudentProfilePictureUseCase
				.uploadStudentProfilePictureRequestDTO =
				uploadStudentProfilePictureRequestDTO;

			const uploadStudentProfilePictureResponseDTO =
				await uploadStudentProfilePictureUseCase
					.execute();

			responseHandler.ok(
				response,
				uploadStudentProfilePictureResponseDTO
			);
		} catch (error) {
			winston.error(
				"Error in uploading student profile picture:",
				error
			);

			next(error);
		}
	}
}