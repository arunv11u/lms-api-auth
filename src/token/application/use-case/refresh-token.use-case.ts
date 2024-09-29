import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { TokenObject, TokenRepository } from "../../domain";
import {
	RefreshTokenRequestDTO,
	RefreshTokenResponseDTO,
	RefreshTokenResponseDTOImpl
} from "../dto";
import { RefreshTokenUseCase } from "./refresh-token.use-case.type";



export class RefreshTokenUseCaseImpl implements
	RefreshTokenUseCase, TokenObject {
	private _unitOfWork: UnitOfWork;
	private _refreshTokenRequestDTO: RefreshTokenRequestDTO;
	private _refreshTokenResponseDTO: RefreshTokenResponseDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._refreshTokenResponseDTO = new RefreshTokenResponseDTOImpl();
	}

	set refreshTokenRequestDTO(refreshTokenRequestDTO: RefreshTokenRequestDTO) {
		this._refreshTokenRequestDTO = refreshTokenRequestDTO;
	}

	async execute(): Promise<RefreshTokenResponseDTO> {
		try {
			await this._unitOfWork.start();

			const tokenRepository = this._unitOfWork
				.getRepository("TokenRepository") as TokenRepository;

			const newTokenPair = await tokenRepository
				.generateTokenPairWithRefreshToken(
					this._refreshTokenRequestDTO.refreshToken
				);

			this._refreshTokenResponseDTO.accessToken =
				newTokenPair.accessToken;
			this._refreshTokenResponseDTO.refreshToken =
				newTokenPair.refreshToken;

			await this._unitOfWork.complete();

			return this._refreshTokenResponseDTO;
		} catch (error) {
			await this._unitOfWork.dispose();

			throw error;
		}
	}
}