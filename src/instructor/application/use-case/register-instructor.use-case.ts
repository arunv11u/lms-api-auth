import { getInstructorFactory } from "../../../global-config";
import { TokenRepository } from "../../../token";
import { getUUIDV4, UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { InstructorEntity, InstructorObject, InstructorRepository } from "../../domain";
import { InstructorFactory } from "../../factory";
import {
	RegisterInstructorRequestDTO,
	RegisterInstructorResponseDTO,
	RegisterInstructorResponseDTOImpl
} from "../dto";
import { RegisterInstructorUseCase } from "./register-instructor.use-case.type";



export class RegisterInstructorUseCaseImpl implements
	RegisterInstructorUseCase, InstructorObject {
	private _unitOfWork: UnitOfWork;
	private _registerInstructorRequestDTO: RegisterInstructorRequestDTO;
	private _registerInstructorResponseDTO: RegisterInstructorResponseDTO;
	private _instructorFactory: InstructorFactory;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._registerInstructorResponseDTO =
			new RegisterInstructorResponseDTOImpl();
		this._instructorFactory = getInstructorFactory();
	}

	set registerInstructorRequestDTO(
		registerInstructorRequestDTO: RegisterInstructorRequestDTO
	) {
		this._registerInstructorRequestDTO = registerInstructorRequestDTO;
	}

	async execute(): Promise<RegisterInstructorResponseDTO> {
		try {
			await this._unitOfWork.start();

			const instructorRepository = this._unitOfWork
				.getRepository("InstructorRepository") as InstructorRepository;
			const tokenRepository = this._unitOfWork
				.getRepository("TokenRepository") as TokenRepository;

			const instructorEntity = this._instructorFactory.make("InstructorEntity") as InstructorEntity;
			instructorEntity.email = this._registerInstructorRequestDTO.email;
			instructorEntity.firstName =
				this._registerInstructorRequestDTO.firstName;
			instructorEntity.id = instructorRepository.getId();
			instructorEntity.lastName =
				this._registerInstructorRequestDTO.lastName;
			instructorEntity.password =
				this._registerInstructorRequestDTO.password;

			const newInstructor = await instructorRepository
				.register(instructorEntity);

			const sessionId = getUUIDV4();
			const accessToken = await tokenRepository
				.createAccessTokenForInstructor(
					sessionId,
					newInstructor
				);
			const refreshToken = await tokenRepository
				.createRefreshTokenForInstructor(
					sessionId,
					newInstructor
				);

			this._registerInstructorResponseDTO.accessToken = accessToken;
			this._registerInstructorResponseDTO.email = newInstructor.email;
			this._registerInstructorResponseDTO.firstName =
				newInstructor.firstName;
			this._registerInstructorResponseDTO.id = newInstructor.id;
			this._registerInstructorResponseDTO.lastName =
				newInstructor.lastName;
			this._registerInstructorResponseDTO.refreshToken = refreshToken;

			await this._unitOfWork.complete();

			return this._registerInstructorResponseDTO;
		} catch (error) {
			await this._unitOfWork.dispose();

			throw error;
		}
	}
}