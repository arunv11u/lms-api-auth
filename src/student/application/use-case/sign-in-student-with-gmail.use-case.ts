import { TokenRepository } from "../../../token";
import { getUUIDV4, UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { StudentObject, StudentRepository } from "../../domain";
import {
	SignInStudentWithGmailRequestDTO,
	SignInStudentWithGmailResponseDTO,
	SignInStudentWithGmailResponseDTOImpl
} from "../dto";
import { SignInStudentWithGmailUseCase } from "./sign-in-student-with-gmail.use-case.type";



export class SignInStudentWithGmailUseCaseImpl implements
	SignInStudentWithGmailUseCase, StudentObject {
	private _unitOfWork: UnitOfWork;
	private _signInStudentWithGmailRequestDTO: SignInStudentWithGmailRequestDTO;
	private _signInStudentWithGmailResponseDTO:
		SignInStudentWithGmailResponseDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._signInStudentWithGmailResponseDTO =
			new SignInStudentWithGmailResponseDTOImpl();
	}

	set signInStudentWithGmailRequestDTO(
		signInStudentWithGmailRequestDTO: SignInStudentWithGmailRequestDTO
	) {
		this._signInStudentWithGmailRequestDTO =
			signInStudentWithGmailRequestDTO;
	}

	async execute(): Promise<SignInStudentWithGmailResponseDTO> {
		try {
			await this._unitOfWork.start();

			const studentRepository = this._unitOfWork
				.getRepository("StudentRepository") as StudentRepository;
			const tokenRepository = this._unitOfWork
				.getRepository("TokenRepository") as TokenRepository;

			const studentEntity = await studentRepository
				.registerStudentWithGoogleOAuth(
					this._signInStudentWithGmailRequestDTO.authCode,
					this._signInStudentWithGmailRequestDTO.redirectUri
				);

			const sessionId = getUUIDV4();
			const accessToken = await tokenRepository
				.createAccessTokenForStudent(
					sessionId,
					studentEntity
				);
			const refreshToken = await tokenRepository
				.createRefreshTokenForStudent(
					sessionId,
					studentEntity
				);

			this._signInStudentWithGmailResponseDTO.accessToken = accessToken;
			this._signInStudentWithGmailResponseDTO.email = studentEntity.email;
			this._signInStudentWithGmailResponseDTO.firstName =
				studentEntity.firstName;
			this._signInStudentWithGmailResponseDTO.id = studentEntity.id;
			this._signInStudentWithGmailResponseDTO.lastName =
				studentEntity.lastName;
			this._signInStudentWithGmailResponseDTO.refreshToken = refreshToken;
			this._signInStudentWithGmailResponseDTO.profilePicture =
				studentEntity.profilePicture;

			await this._unitOfWork.complete();

			return this._signInStudentWithGmailResponseDTO;
		} catch (error) {
			await this._unitOfWork.dispose();

			throw error;
		}
	}
}