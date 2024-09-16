import nconf from "nconf";
import { Axios, AxiosImpl } from "@arunvaradharajalu/common.axios";
import { ErrorCodes, GoogleOAuthApi, GoogleTokenResponse } from "../types";
import { GenericError } from "../errors";


class GoogleOAuthApiImpl implements GoogleOAuthApi {
	private _url: string = "https://oauth2.googleapis.com/token";
	private _clientId: string;
	private _clientSecret: string;
	private _grantType: string = "authorization_code";
	private _axios: Axios;

	constructor() {
		this._clientId = nconf.get("GOOGLE_CLIENT_ID");
		this._clientSecret = nconf.get("GOOGLE_CLIENT_SECRET");
		this._axios = new AxiosImpl();
	}

	async getTokens(
		authCode: string,
		redirectUri: string
	): Promise<GoogleTokenResponse> {
		try {
			const response = await this._axios.post<GoogleTokenResponse>(
				this._url,
				{
					code: authCode,
					client_id: this._clientId,
					client_secret: this._clientSecret,
					redirect_uri: redirectUri,
					grant_type: this._grantType
				}
			);
	
			return response.data;
		} catch (error) {
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Internal Error in Google OAuth Api while retrieving tokens"),
				errorCode: 500
			});
		}
	}
}

export {
	GoogleOAuthApiImpl
};