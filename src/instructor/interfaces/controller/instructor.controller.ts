/* eslint-disable max-lines */
import { Controller, Get, Post, Put } from "@arunvaradharajalu/common.decorators";
import { Request, Response, NextFunction } from "express";
import {
	ErrorCodes,
	GenericError,
	getResponseHandler,
	winstonLogger
} from "../../../utils";
import {
	ChangeInstructorPasswordRequestDTOImpl,
	ChangeInstructorPasswordUseCase,
	ForgotInstructorPasswordRequestDTOImpl,
	ForgotInstructorPasswordUseCase,
	GetInstructorProfileRequestDTOImpl,
	GetInstructorProfileUseCase,
	RegisterInstructorRequestDTOImpl,
	RegisterInstructorUseCase,
	ResetInstructorPasswordRequestDTOImpl,
	ResetInstructorPasswordUseCase,
	SignInInstructorRequestDTOImpl,
	SignInInstructorUseCase,
	SignInInstructorWithGmailRequestDTOImpl,
	SignInInstructorWithGmailUseCase,
	UpdateInstructorProfileRequestDTOImpl,
	UpdateInstructorProfileUseCase,
	UploadInstructorProfilePictureRequestDTOImpl,
	UploadInstructorProfilePictureUseCase
} from "../../application";
import { authorizationTokenName, getInstructorFactory } from "../../../global-config";



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

	@Post("/sign-in/gmail")
	async signInWithGmail(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("sign-in-ing with gmail as a instructor");

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

			const instructorFactory = getInstructorFactory();
			const responseHandler = getResponseHandler();

			const signInInstructorWithGmailRequestDTO =
				new SignInInstructorWithGmailRequestDTOImpl();
			signInInstructorWithGmailRequestDTO.authCode =
				request.body.authCode;
			signInInstructorWithGmailRequestDTO.redirectUri =
				request.body.redirectUri;

			const signInInstructorWithGmailUseCase = instructorFactory.make("SignInInstructorWithGmailUseCase") as SignInInstructorWithGmailUseCase;
			signInInstructorWithGmailUseCase
				.signInInstructorWithGmailRequestDTO =
				signInInstructorWithGmailRequestDTO;

			const signInInstructorWithGmailResponseDTO =
				await signInInstructorWithGmailUseCase.execute();

			responseHandler.ok(response, signInInstructorWithGmailResponseDTO);
		} catch (error) {
			winston.error(
				"Error in instructor sign-in with gmail:",
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
			winston.info("Instructor triggered a forgot password");

			if (!request.body.email)
				throw new GenericError({
					code: ErrorCodes.instructorEmailRequired,
					error: new Error("Instructor email is required"),
					errorCode: 400
				});

			const instructorFactory = getInstructorFactory();
			const responseHandler = getResponseHandler();

			const forgotInstructorPasswordRequestDTO =
				new ForgotInstructorPasswordRequestDTOImpl();
			forgotInstructorPasswordRequestDTO.email = request.body.email;

			const forgotInstructorPasswordUseCase = instructorFactory.make("ForgotInstructorPasswordUseCase") as ForgotInstructorPasswordUseCase;
			forgotInstructorPasswordUseCase.forgotInstructorPasswordRequestDTO =
				forgotInstructorPasswordRequestDTO;

			await forgotInstructorPasswordUseCase.execute();

			responseHandler.ok(response);
		} catch (error) {
			winston.error(
				"Error in sending forgot password email for a instructor:",
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
			winston.info("Instructor trting to reset a password");

			if (!request.body.email)
				throw new GenericError({
					code: ErrorCodes.instructorEmailRequired,
					error: new Error("Instructor email is required"),
					errorCode: 400
				});

			if (!request.body.verificationCode)
				throw new GenericError({
					code: ErrorCodes.instructorEmailRequired,
					error: new Error("Verification Code is required"),
					errorCode: 400
				});

			if (!request.body.password)
				throw new GenericError({
					code: ErrorCodes.instructorEmailRequired,
					error: new Error("Password is required"),
					errorCode: 400
				});

			const instructorFactory = getInstructorFactory();
			const responseHandler = getResponseHandler();

			const resetInstructorPasswordRequestDTO =
				new ResetInstructorPasswordRequestDTOImpl();
			resetInstructorPasswordRequestDTO.email = request.body.email;
			resetInstructorPasswordRequestDTO.password = request.body.password;
			resetInstructorPasswordRequestDTO.verificationCode =
				request.body.verificationCode;

			const resetInstructorPasswordUseCase = instructorFactory.make("ResetInstructorPasswordUseCase") as ResetInstructorPasswordUseCase;
			resetInstructorPasswordUseCase.resetInstructorPasswordRequestDTO =
				resetInstructorPasswordRequestDTO;

			await resetInstructorPasswordUseCase.execute();

			responseHandler.ok(response);
		} catch (error) {
			winston.error(
				"Error in resetting password for a instructor:",
				error
			);

			next(error);
		}
	}

	@Get("/")
	async getInstructorProfile(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("Retrieving instructor profile");

			const authorizationToken = request.header(authorizationTokenName);
			if (!authorizationToken)
				throw new GenericError({
					code: ErrorCodes.invalidAuthorizationToken,
					error: new Error("Invalid authorization token"),
					errorCode: 400
				});

			const instructorFactory = getInstructorFactory();
			const responseHandler = getResponseHandler();

			const getInstructorProfileRequestDTO =
				new GetInstructorProfileRequestDTOImpl();
			getInstructorProfileRequestDTO.authorizationToken =
				authorizationToken;

			const getInstructorProfileUseCase = instructorFactory.make("GetInstructorProfileUseCase") as GetInstructorProfileUseCase;
			getInstructorProfileUseCase.getInstructorProfileRequestDTO =
				getInstructorProfileRequestDTO;

			const getInstructorProfileResponseDTO =
				await getInstructorProfileUseCase
					.execute();

			responseHandler.ok(response, getInstructorProfileResponseDTO);
		} catch (error) {
			winston.error(
				"Error in retrieving instructor profile:",
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
			winston.info("Changing instructor password");

			const authorizationToken = request.header(authorizationTokenName);
			if (!authorizationToken)
				throw new GenericError({
					code: ErrorCodes.invalidAuthorizationToken,
					error: new Error("Invalid authorization token"),
					errorCode: 400
				});

			if (!request.body.password)
				throw new GenericError({
					code: ErrorCodes.instructorPasswordRequired,
					error: new Error("Instructor password required"),
					errorCode: 400
				});

			const instructorFactory = getInstructorFactory();
			const responseHandler = getResponseHandler();

			const changeInstructorPasswordRequestDTO =
				new ChangeInstructorPasswordRequestDTOImpl();
			changeInstructorPasswordRequestDTO.authorizationToken =
				authorizationToken;
			changeInstructorPasswordRequestDTO.password = request.body.password;

			const changeInstructorPasswordUseCase = instructorFactory.make("ChangeInstructorPasswordUseCase") as ChangeInstructorPasswordUseCase;
			changeInstructorPasswordUseCase.changeInstructorPasswordRequestDTO =
				changeInstructorPasswordRequestDTO;

			await changeInstructorPasswordUseCase
				.execute();

			responseHandler.ok(response);
		} catch (error) {
			winston.error(
				"Error in changing instructor password:",
				error
			);

			next(error);
		}
	}

	@Post("/upload-instructor-profile-picture")
	async uploadInstructorProfilePicture(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("Uploading instructor profile picture");

			const authorizationToken = request.header(authorizationTokenName);
			if (!authorizationToken)
				throw new GenericError({
					code: ErrorCodes.invalidAuthorizationToken,
					error: new Error("Invalid authorization token"),
					errorCode: 400
				});

			if (!request.body.mimeType)
				throw new GenericError({
					code: ErrorCodes.instructorProfilePictureMimeTypeRequired,
					error: new Error("Mime type required"),
					errorCode: 400
				});

			const instructorFactory = getInstructorFactory();
			const responseHandler = getResponseHandler();

			const uploadInstructorProfilePictureRequestDTO =
				new UploadInstructorProfilePictureRequestDTOImpl();
			uploadInstructorProfilePictureRequestDTO.authorizationToken =
				authorizationToken;
			uploadInstructorProfilePictureRequestDTO.mimeType =
				request.body.mimeType;

			const uploadInstructorProfilePictureUseCase = instructorFactory.make("UploadInstructorProfilePictureUseCase") as UploadInstructorProfilePictureUseCase;
			uploadInstructorProfilePictureUseCase
				.uploadInstructorProfilePictureRequestDTO =
				uploadInstructorProfilePictureRequestDTO;

			const uploadInstructorProfilePictureResponseDTO =
				await uploadInstructorProfilePictureUseCase
					.execute();

			responseHandler.ok(
				response,
				uploadInstructorProfilePictureResponseDTO
			);
		} catch (error) {
			winston.error(
				"Error in uploading instructor profile picture:",
				error
			);

			next(error);
		}
	}

	@Put("/")
	async updateInstructorProfile(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("Updating instructor profile");

			const authorizationToken = request.header(authorizationTokenName);
			if (!authorizationToken)
				throw new GenericError({
					code: ErrorCodes.invalidAuthorizationToken,
					error: new Error("Invalid authorization token"),
					errorCode: 400
				});

			const instructorFactory = getInstructorFactory();
			const responseHandler = getResponseHandler();

			const updateInstructorProfileRequestDTO =
				new UpdateInstructorProfileRequestDTOImpl();
			updateInstructorProfileRequestDTO.authorizationToken =
				authorizationToken;
			updateInstructorProfileRequestDTO.designation = 
				request.body.designation;
			updateInstructorProfileRequestDTO.firstName =
				request.body.firstName;
			updateInstructorProfileRequestDTO.lastName =
				request.body.lastName;
			updateInstructorProfileRequestDTO.profilePicture =
				request.body.profilePicture;

			const updateInstructorProfileUseCase = instructorFactory.make("UpdateInstructorProfileUseCase") as UpdateInstructorProfileUseCase;
			updateInstructorProfileUseCase
				.updateInstructorProfileRequestDTO =
				updateInstructorProfileRequestDTO;

			const updateInstructorProfileResponseDTO =
				await updateInstructorProfileUseCase
					.execute();

			responseHandler.ok(
				response,
				updateInstructorProfileResponseDTO
			);
		} catch (error) {
			winston.error(
				"Error in uploading instructor profile picture:",
				error
			);

			next(error);
		}
	}
}