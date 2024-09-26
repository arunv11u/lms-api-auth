import { getStudentFactory } from "../../../global-config";
import { TokenRepository } from "../../../token";
import { ErrorCodes, GenericError, getUUIDV4, UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { StudentObject, StudentRepository } from "../../domain";
import { StudentFactory } from "../../factory";
import {
	SignInStudentRequestDTO,
	SignInStudentResponseDTO,
	SignInStudentResponseDTOImpl
} from "../dto";
import { SignInStudentUseCase } from "./sign-in-student.use-case.type";




export class SignInStudentUseCaseImpl implements
	SignInStudentUseCase, StudentObject {
	private _unitOfWork: UnitOfWork;
	private _signInStudentRequestDTO: SignInStudentRequestDTO;
	private _signInStudentResponseDTO: SignInStudentResponseDTO;
	private _studentFactory: StudentFactory;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._signInStudentResponseDTO = new SignInStudentResponseDTOImpl();
		this._studentFactory = getStudentFactory();
	}

	set signInStudentRequestDTO(
		signInStudentRequestDTO: SignInStudentRequestDTO
	) {
		this._signInStudentRequestDTO = signInStudentRequestDTO;
	}

	async execute(): Promise<SignInStudentResponseDTO> {
		const studentRepository = this._unitOfWork
			.getRepository("StudentRepository") as StudentRepository;
		const tokenRepository = this._unitOfWork
			.getRepository("TokenRepository") as TokenRepository;

		const { isValidCredentials } = await studentRepository
			.signInWithEmail(
				this._signInStudentRequestDTO.email,
				this._signInStudentRequestDTO.password
			);
		if (!isValidCredentials) throw new GenericError({
			code: ErrorCodes.invalidCredentials,
			error: new Error("Invalid Credentials"),
			errorCode: 400
		});

		const student = await studentRepository
			.getUserWithEmail(this._signInStudentRequestDTO.email);

		const sessionId = getUUIDV4();
		const accessToken = await tokenRepository
			.createAccessTokenForStudent(
				sessionId,
				student
			);
		const refreshToken = await tokenRepository
			.createRefreshTokenForStudent(
				sessionId,
				student
			);

		this._signInStudentResponseDTO.accessToken = accessToken;
		this._signInStudentResponseDTO.email = student.email;
		this._signInStudentResponseDTO.firstName = student.firstName;
		this._signInStudentResponseDTO.id = student.id;
		this._signInStudentResponseDTO.lastName = student.lastName;
		this._signInStudentResponseDTO.refreshToken = refreshToken;
		this._signInStudentResponseDTO.profilePicture = student.profilePicture;

		return this._signInStudentResponseDTO;
	}
}
