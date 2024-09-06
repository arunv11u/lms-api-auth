/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { GenericError } from "../../errors";
import {
	CustomResponse,
	TypedResponse
} from "../express";
import { ErrorCodes } from "../errors";

interface ResponseHandler {
	ok<ResBody>(
		response: TypedResponse<CustomResponse<ResBody>, any>
	): express.Response<CustomResponse<ResBody>>;
	ok<ResBody>(
		response: TypedResponse<CustomResponse<ResBody>, any>,
		data: ResBody
	): express.Response<CustomResponse<ResBody>>;
	created<ResBody>(
		response: TypedResponse<CustomResponse<ResBody>, any>
	): express.Response<CustomResponse<ResBody>>;
	created<ResBody>(
		response: TypedResponse<CustomResponse<ResBody>, any>,
		data: ResBody
	): express.Response<CustomResponse<ResBody>>;
	clientError(): GenericError;
	clientError(code: ErrorCodes, message: string): GenericError;
	unauthorized(): GenericError;
	unauthorized(code: ErrorCodes, message: string): GenericError;
	paymentRequired(): GenericError;
	paymentRequired(code: ErrorCodes, message: string): GenericError;
	forbidden(): GenericError;
	forbidden(code: ErrorCodes, message: string): GenericError;
	notFound(): GenericError;
	notFound(code: ErrorCodes, message: string): GenericError;
	conflict(): GenericError;
	conflict(code: ErrorCodes, message: string): GenericError;
	tooManyRequests(): GenericError;
	tooManyRequests(code: ErrorCodes, message: string): GenericError;
	internalError(): GenericError;
	internalError(code: ErrorCodes, message: string): GenericError;
}

export {
	ResponseHandler
};
