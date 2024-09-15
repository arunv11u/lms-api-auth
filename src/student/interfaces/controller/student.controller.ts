import { Controller, Post } from "@arunvaradharajalu/common.decorators";
import { Request, Response, NextFunction } from "express";
import { ErrorCodes, GenericError, getResponseHandler, winstonLogger } from "../../../utils";
import { getStudentFactory } from "../../../global-config";
import { RegisterStudentRequestDTOImpl, RegisterStudentUseCase } from "../../application";


@Controller("/student")
export class StudentController {

	@Post("/")
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
					error: new Error("Student email required"),
					errorCode: 400
				});

			if (!request.body.firstName)
				throw new GenericError({
					code: ErrorCodes.studentFirstNameRequired,
					error: new Error("Student first name required"),
					errorCode: 400
				});

			if (!request.body.lastName)
				throw new GenericError({
					code: ErrorCodes.studentLastNameRequired,
					error: new Error("Student last name required"),
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
			console.error(error);
			winston.error(
				"Error in registering a student:",
				error
			);

			next(error);
		}
	}

}