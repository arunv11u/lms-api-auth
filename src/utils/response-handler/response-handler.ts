/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Response } from "express";
import { GenericError } from "../errors";
import {
	CustomResponse,
	ErrorCodes,
	ResponseHandler,
	TypedResponse
} from "../types";



export class ResponseHandlerImpl implements ResponseHandler {


	private _setResponseTypeJSON(response: Response) {
		response.type("application/json");
	}

	ok<ResBody>(
		response: TypedResponse<CustomResponse<ResBody | null>, any>,
		data?: ResBody
	): express.Response<CustomResponse<ResBody>> {
		if (!response)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error(
					"Response object is undefined, expected express response object"
				),
				errorCode: 500,
			});

		this._setResponseTypeJSON(response);

		if (!data) return response.status(200).send({ data: null });

		return response.status(200).send({ data });
	}

	created<ResBody>(
		response: TypedResponse<CustomResponse<ResBody | null>, any>,
		data?: ResBody
	): express.Response<CustomResponse<ResBody>> {
		if (!response)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error(
					"Response object is undefined, expected express response object"
				),
				errorCode: 500,
			});

		this._setResponseTypeJSON(response);

		if (!data) return response.status(201).send({ data: null });

		return response.status(201).send({ data });
	}

	clientError(code: ErrorCodes = ErrorCodes.clientError, message = "Bad Request"): GenericError {
		return new GenericError({
			code,
			error: new Error(message),
			errorCode: 400
		});
	}

	unauthorized(code: ErrorCodes = ErrorCodes.unauthorized, message = "Unauthorized"): GenericError {
		return new GenericError({
			code,
			error: new Error(message),
			errorCode: 401
		});
	}

	paymentRequired(code: ErrorCodes = ErrorCodes.paymentRequired, message = "Payment required"): GenericError {
		return new GenericError({
			code,
			error: new Error(message),
			errorCode: 402
		});
	}

	forbidden(code: ErrorCodes = ErrorCodes.forbidden, message = "Forbidden"): GenericError {
		return new GenericError({
			code,
			error: new Error(message),
			errorCode: 403
		});
	}

	notFound(code: ErrorCodes = ErrorCodes.notFound, message = "Not found"): GenericError {
		return new GenericError({
			code,
			error: new Error(message),
			errorCode: 404
		});
	}

	conflict(code: ErrorCodes = ErrorCodes.conflict, message = "Conflict"): GenericError {
		return new GenericError({
			code,
			error: new Error(message),
			errorCode: 409
		});
	}

	tooManyRequests(code: ErrorCodes = ErrorCodes.tooManyRequests, message = "Too many requests"): GenericError {
		return new GenericError({
			code,
			error: new Error(message),
			errorCode: 429
		});
	}

	internalError(code: ErrorCodes = ErrorCodes.internalError, message = "Internal server error"): GenericError {
		return new GenericError({
			code,
			error: new Error(message),
			errorCode: 500
		});
	}
}
