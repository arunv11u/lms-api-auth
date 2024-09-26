import { TokenRepository } from "../../../token";
import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { StudentObject, StudentRepository } from "../../domain";
import {
	UpdateStudentProfileRequestDTO,
	UpdateStudentProfileResponseDTO,
	UpdateStudentProfileResponseDTOImpl
} from "../dto";
import { UpdateStudentProfileUseCase } from "./update-student-profile.use-case.type";



export class UpdateStudentProfileUseCaseImpl implements
	UpdateStudentProfileUseCase, StudentObject {
	private _unitOfWork: UnitOfWork;
	private _updateStudentProfileRequestDTO:
		UpdateStudentProfileRequestDTO;
	private _updateStudentProfileResponseDTO:
		UpdateStudentProfileResponseDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._updateStudentProfileResponseDTO =
			new UpdateStudentProfileResponseDTOImpl();
	}

	set updateStudentProfileRequestDTO(
		updateStudentProfileRequestDTO:
			UpdateStudentProfileRequestDTO
	) {
		this._updateStudentProfileRequestDTO =
			updateStudentProfileRequestDTO;
	}

	async execute(): Promise<UpdateStudentProfileResponseDTO> {
		const studentRepository = this._unitOfWork
			.getRepository("StudentRepository") as StudentRepository;
		const tokenRepository = this._unitOfWork
			.getRepository("TokenRepository") as TokenRepository;

		const studentEntity = await tokenRepository
			.validateStudentAuthorizationToken(
				this._updateStudentProfileRequestDTO.authorizationToken
			);

		if (this._updateStudentProfileRequestDTO.firstName)
			studentEntity.firstName =
				this._updateStudentProfileRequestDTO.firstName;

		if (this._updateStudentProfileRequestDTO.lastName)
			studentEntity.lastName =
				this._updateStudentProfileRequestDTO.lastName;

		if (this._updateStudentProfileRequestDTO.profilePicture)
			studentEntity.profilePicture =
				this._updateStudentProfileRequestDTO.profilePicture;

		const updatedStudentEntity = await studentRepository
			.updateStudentProfile(studentEntity);

		this._updateStudentProfileResponseDTO.email =
			updatedStudentEntity.email;
		this._updateStudentProfileResponseDTO.firstName =
			updatedStudentEntity.firstName;
		this._updateStudentProfileResponseDTO.id =
			updatedStudentEntity.id;
		this._updateStudentProfileResponseDTO.lastName =
			updatedStudentEntity.lastName;
		this._updateStudentProfileResponseDTO.profilePicture =
			updatedStudentEntity.profilePicture;

		return this._updateStudentProfileResponseDTO;
	}
}