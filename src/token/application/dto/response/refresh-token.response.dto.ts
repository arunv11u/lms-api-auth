import { RefreshTokenResponseDTO } from "./refresh-token.response.dto.type";


export class RefreshTokenResponseDTOImpl implements
	RefreshTokenResponseDTO {
	accessToken: string;
	refreshToken: string;
}