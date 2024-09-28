import { TokenRepository } from "../../../token";
import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { InstructorObject, InstructorRepository } from "../../domain";
import {
	UpdateInstructorProfileRequestDTO,
	UpdateInstructorProfileResponseDTO,
	UpdateInstructorProfileResponseDTOImpl
} from "../dto";
import { UpdateInstructorProfileUseCase } from "./update-instructor-profile.use-case.type";



export class UpdateInstructorProfileUseCaseImpl implements
	UpdateInstructorProfileUseCase, InstructorObject {
	private _unitOfWork: UnitOfWork;
	private _updateInstructorProfileRequestDTO:
		UpdateInstructorProfileRequestDTO;
	private _updateInstructorProfileResponseDTO:
		UpdateInstructorProfileResponseDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._updateInstructorProfileResponseDTO =
			new UpdateInstructorProfileResponseDTOImpl();
	}

	set updateInstructorProfileRequestDTO(
		updateInstructorProfileRequestDTO: UpdateInstructorProfileRequestDTO
	) {
		this._updateInstructorProfileRequestDTO =
			updateInstructorProfileRequestDTO;
	}

	async execute(): Promise<UpdateInstructorProfileResponseDTO> {
		const instructorRepository = this._unitOfWork
			.getRepository("InstructorRepository") as InstructorRepository;
		const tokenRepository = this._unitOfWork
			.getRepository("TokenRepository") as TokenRepository;

		const instructorEntity = await tokenRepository
			.validateInstructorAuthorizationToken(
				this._updateInstructorProfileRequestDTO.authorizationToken
			);

		if (this._updateInstructorProfileRequestDTO.firstName)
			instructorEntity.firstName =
				this._updateInstructorProfileRequestDTO.firstName;

		if (this._updateInstructorProfileRequestDTO.lastName)
			instructorEntity.lastName =
				this._updateInstructorProfileRequestDTO.lastName;

		if (this._updateInstructorProfileRequestDTO.profilePicture)
			instructorEntity.profilePicture =
				this._updateInstructorProfileRequestDTO.profilePicture;

		const updatedInstructorEntity = await instructorRepository
			.updateInstructorProfile(instructorEntity);

		this._updateInstructorProfileResponseDTO.email =
			updatedInstructorEntity.email;
		this._updateInstructorProfileResponseDTO.firstName =
			updatedInstructorEntity.firstName;
		this._updateInstructorProfileResponseDTO.id =
			updatedInstructorEntity.id;
		this._updateInstructorProfileResponseDTO.lastName =
			updatedInstructorEntity.lastName;
		this._updateInstructorProfileResponseDTO.profilePicture =
			updatedInstructorEntity.profilePicture;

		return this._updateInstructorProfileResponseDTO;
	}
}