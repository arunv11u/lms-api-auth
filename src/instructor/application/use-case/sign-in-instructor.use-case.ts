import { TokenRepository } from "../../../token";
import { ErrorCodes, GenericError, getUUIDV4, UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { InstructorObject, InstructorRepository } from "../../domain";
import {
	SignInInstructorRequestDTO,
	SignInInstructorResponseDTO,
	SignInInstructorResponseDTOImpl
} from "../dto";
import { SignInInstructorUseCase } from "./sign-in-instructor.use-case.type";




export class SignInInstructorUseCaseImpl implements
	SignInInstructorUseCase, InstructorObject {
	private _unitOfWork: UnitOfWork;
	private _signInInstructorRequestDTO: SignInInstructorRequestDTO;
	private _signInInstructorResponseDTO: SignInInstructorResponseDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._signInInstructorResponseDTO =
			new SignInInstructorResponseDTOImpl();
	}

	set signInInstructorRequestDTO(
		signInInstructorRequestDTO: SignInInstructorRequestDTO
	) {
		this._signInInstructorRequestDTO = signInInstructorRequestDTO;
	}

	async execute(): Promise<SignInInstructorResponseDTO> {
		const instructorRepository = this._unitOfWork
			.getRepository("InstructorRepository") as InstructorRepository;
		const tokenRepository = this._unitOfWork
			.getRepository("TokenRepository") as TokenRepository;

		const { isValidCredentials } = await instructorRepository
			.signInWithEmail(
				this._signInInstructorRequestDTO.email,
				this._signInInstructorRequestDTO.password
			);
		if (!isValidCredentials) throw new GenericError({
			code: ErrorCodes.invalidCredentials,
			error: new Error("Invalid Credentials"),
			errorCode: 400
		});

		const instructor = await instructorRepository
			.getUserWithEmail(this._signInInstructorRequestDTO.email);

		const sessionId = getUUIDV4();
		const accessToken = await tokenRepository
			.createAccessTokenForInstructor(
				sessionId,
				instructor
			);
		const refreshToken = await tokenRepository
			.createRefreshTokenForInstructor(
				sessionId,
				instructor
			);

		this._signInInstructorResponseDTO.accessToken = accessToken;
		this._signInInstructorResponseDTO.email = instructor.email;
		this._signInInstructorResponseDTO.firstName = instructor.firstName;
		this._signInInstructorResponseDTO.id = instructor.id;
		this._signInInstructorResponseDTO.lastName = instructor.lastName;
		this._signInInstructorResponseDTO.refreshToken = refreshToken;
		this._signInInstructorResponseDTO.profilePicture =
			instructor.profilePicture;

		return this._signInInstructorResponseDTO;
	}
}
