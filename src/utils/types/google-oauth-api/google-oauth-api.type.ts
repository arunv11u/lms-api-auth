
interface GoogleTokenResponse {
	id_token: string;
	access_token: string;
}

abstract class GoogleOAuthApi {
	abstract getTokens(
		authCode: string, 
		redirectUri: string
	): Promise<GoogleTokenResponse>;
}

export {
	GoogleTokenResponse,
	GoogleOAuthApi
};