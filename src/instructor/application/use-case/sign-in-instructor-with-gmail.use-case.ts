import { TokenRepository } from "../../../token";
import { getUUIDV4, UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { InstructorObject, InstructorRepository } from "../../domain";
import {
	SignInInstructorWithGmailRequestDTO,
	SignInInstructorWithGmailResponseDTO,
	SignInInstructorWithGmailResponseDTOImpl
} from "../dto";
import { SignInInstructorWithGmailUseCase } from "./sign-in-instructor-with-gmail.use-case.type";



export class SignInInstructorWithGmailUseCaseImpl implements
	SignInInstructorWithGmailUseCase, InstructorObject {
	private _unitOfWork: UnitOfWork;
	private _signInInstructorWithGmailRequestDTO:
		SignInInstructorWithGmailRequestDTO;
	private _signInInstructorWithGmailResponseDTO:
		SignInInstructorWithGmailResponseDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._signInInstructorWithGmailResponseDTO =
			new SignInInstructorWithGmailResponseDTOImpl();
	}

	set signInInstructorWithGmailRequestDTO(
		signInInstructorWithGmailRequestDTO:
			SignInInstructorWithGmailRequestDTO
	) {
		this._signInInstructorWithGmailRequestDTO =
			signInInstructorWithGmailRequestDTO;
	}

	async execute(): Promise<SignInInstructorWithGmailResponseDTO> {
		try {
			await this._unitOfWork.start();

			const instructorRepository = this._unitOfWork
				.getRepository("InstructorRepository") as InstructorRepository;
			const tokenRepository = this._unitOfWork
				.getRepository("TokenRepository") as TokenRepository;

			const instructorEntity = await instructorRepository
				.registerInstructorWithGoogleOAuth(
					this._signInInstructorWithGmailRequestDTO.authCode,
					this._signInInstructorWithGmailRequestDTO.redirectUri
				);

			const sessionId = getUUIDV4();
			const accessToken = await tokenRepository
				.createAccessTokenForInstructor(
					sessionId,
					instructorEntity
				);
			const refreshToken = await tokenRepository
				.createRefreshTokenForInstructor(
					sessionId,
					instructorEntity
				);

			this._signInInstructorWithGmailResponseDTO.accessToken =
				accessToken;
			this._signInInstructorWithGmailResponseDTO.email =
				instructorEntity.email;
			this._signInInstructorWithGmailResponseDTO.firstName =
				instructorEntity.firstName;
			this._signInInstructorWithGmailResponseDTO.id = instructorEntity.id;
			this._signInInstructorWithGmailResponseDTO.lastName =
				instructorEntity.lastName;
			this._signInInstructorWithGmailResponseDTO.refreshToken =
				refreshToken;
			this._signInInstructorWithGmailResponseDTO.profilePicture =
				instructorEntity.profilePicture;

			await this._unitOfWork.complete();

			return this._signInInstructorWithGmailResponseDTO;
		} catch (error) {
			await this._unitOfWork.dispose();

			throw error;
		}
	}
}