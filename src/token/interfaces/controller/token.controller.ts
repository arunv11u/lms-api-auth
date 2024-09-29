import { Controller, Post } from "@arunvaradharajalu/common.decorators";
import {
	Request,
	Response,
	NextFunction
} from "express";
import { ErrorCodes, GenericError, getResponseHandler, winstonLogger } from "../../../utils";
import { getTokenFactory } from "../../../global-config";
import { RefreshTokenRequestDTOImpl, RefreshTokenUseCase } from "../../application";


@Controller("/token")
export class TokenController {

	@Post("/refresh")
	async register(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const winston = winstonLogger.winston;
		try {
			winston.info("Refreshing a token to get a new pair token");

			if (!request.body.refreshToken)
				throw new GenericError({
					code: ErrorCodes.refreshTokenRequired,
					error: new Error("Refresh token is required"),
					errorCode: 400
				});

			const tokenFactory = getTokenFactory();
			const responseHandler = getResponseHandler();

			const refreshTokenRequestDTO =
				new RefreshTokenRequestDTOImpl();
			refreshTokenRequestDTO.refreshToken = request.body.refreshToken;

			const refreshTokenUseCase = tokenFactory.make("RefreshTokenUseCase") as RefreshTokenUseCase;
			refreshTokenUseCase.refreshTokenRequestDTO =
				refreshTokenRequestDTO;

			const refreshTokenResponseDTO =
				await refreshTokenUseCase.execute();

			responseHandler.ok(response, refreshTokenResponseDTO);
		} catch (error) {
			winston.error(
				"Error in refreshing a token:",
				error
			);

			next(error);
		}
	}
}