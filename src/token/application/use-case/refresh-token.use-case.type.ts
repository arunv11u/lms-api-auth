import { UseCase } from "../../../utils";
import { RefreshTokenRequestDTO, RefreshTokenResponseDTO } from "../dto";



export abstract class RefreshTokenUseCase implements UseCase {
	abstract set refreshTokenRequestDTO(
		refreshTokenRequestDTO: RefreshTokenRequestDTO
	);

	abstract execute(): Promise<RefreshTokenResponseDTO>;
}