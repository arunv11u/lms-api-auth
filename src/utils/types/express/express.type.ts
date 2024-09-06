/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";


type TypedResponse<ResBody, Locals extends Record<string, any>> =
	Response<ResBody, Locals>;

interface CustomResponse<T> {
	data: T;
}

export {
	TypedResponse,
	CustomResponse
};
