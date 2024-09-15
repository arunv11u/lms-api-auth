import { StudentFactory } from "../..";
import { getStudentFactory } from "../../../global-config";
import { TokenRepository } from "../../../token";
import { getUUIDV4, UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { StudentEntity, StudentObject, StudentRepository } from "../../domain";
import { RegisterStudentRequestDTO, RegisterStudentResponseDTO, RegisterStudentResponseDTOImpl } from "../dto";
import { RegisterStudentUseCase } from "./register-student.use-case.type";



export class RegisterStudentUseCaseImpl implements
	RegisterStudentUseCase, StudentObject {
	private _unitOfWork: UnitOfWork;
	private _registerStudentRequestDTO: RegisterStudentRequestDTO;
	private _registerStudentResponseDTO: RegisterStudentResponseDTO;
	private _studentFactory: StudentFactory;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._registerStudentResponseDTO = new RegisterStudentResponseDTOImpl();
		this._studentFactory = getStudentFactory();
	}

	set registerStudentRequestDTO(
		registerStudentRequestDTO: RegisterStudentRequestDTO
	) {
		this._registerStudentRequestDTO = registerStudentRequestDTO;
	}

	async execute(): Promise<RegisterStudentResponseDTO> {
		try {
			await this._unitOfWork.start();

			const studentRepository = this._unitOfWork
				.getRepository("StudentRepository") as StudentRepository;
			const tokenRepository = this._unitOfWork
				.getRepository("TokenRepository") as TokenRepository;

			const studentEntity = this._studentFactory.make("StudentEntity") as StudentEntity;
			studentEntity.email = this._registerStudentRequestDTO.email;
			studentEntity.firstName = this._registerStudentRequestDTO.firstName;
			studentEntity.id = studentRepository.getId();
			studentEntity.lastName = this._registerStudentRequestDTO.lastName;
			studentEntity.password = this._registerStudentRequestDTO.password;

			const newStudent = await studentRepository.register(studentEntity);

			const sessionId = getUUIDV4();
			const accessToken = await tokenRepository
				.createAccessTokenForStudent(
					sessionId,
					newStudent
				);
			const refreshToken = await tokenRepository
				.createRefreshTokenForStudent(
					sessionId,
					newStudent
				);

			this._registerStudentResponseDTO.accessToken = accessToken;
			this._registerStudentResponseDTO.email = newStudent.email;
			this._registerStudentResponseDTO.firstName = newStudent.firstName;
			this._registerStudentResponseDTO.id = newStudent.id;
			this._registerStudentResponseDTO.lastName = newStudent.lastName;
			this._registerStudentResponseDTO.refreshToken = refreshToken;

			await this._unitOfWork.complete();

			return this._registerStudentResponseDTO;
		} catch (error) {
			await this._unitOfWork.dispose();

			throw error;
		}
	}
}