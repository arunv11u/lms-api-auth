import { TokenRepository } from "../../../token";
import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { InstructorObject } from "../../domain";
import {
	GetInstructorProfileRequestDTO,
	GetInstructorProfileResponseDTO,
	GetInstructorProfileResponseDTOImpl
} from "../dto";
import { GetInstructorProfileUseCase } from "./get-instructor-profile.use-case.type";



export class GetInstructorProfileUseCaseImpl implements
	GetInstructorProfileUseCase, InstructorObject {
	private _unitOfWork: UnitOfWork;
	private _getInstructorProfileRequestDTO: GetInstructorProfileRequestDTO;
	private _getInstructorProfileResponseDTO: GetInstructorProfileResponseDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._getInstructorProfileResponseDTO =
			new GetInstructorProfileResponseDTOImpl();
	}

	set getInstructorProfileRequestDTO(
		getInstructorProfileRequestDTO: GetInstructorProfileRequestDTO
	) {
		this._getInstructorProfileRequestDTO = getInstructorProfileRequestDTO;
	}

	async execute(): Promise<GetInstructorProfileResponseDTO> {
		const tokenRepository = this._unitOfWork
			.getRepository("TokenRepository") as TokenRepository;

		const instructorEntity = await tokenRepository
			.validateInstructorAuthorizationToken(
				this._getInstructorProfileRequestDTO.authorizationToken
			);

		this._getInstructorProfileResponseDTO.designation = 
			instructorEntity.designation;
		this._getInstructorProfileResponseDTO.email = instructorEntity.email;
		this._getInstructorProfileResponseDTO.firstName =
			instructorEntity.firstName;
		this._getInstructorProfileResponseDTO.id = instructorEntity.id;
		this._getInstructorProfileResponseDTO.lastName =
			instructorEntity.lastName;
		this._getInstructorProfileResponseDTO.profilePicture =
			instructorEntity.profilePicture;

		return this._getInstructorProfileResponseDTO;
	}
}