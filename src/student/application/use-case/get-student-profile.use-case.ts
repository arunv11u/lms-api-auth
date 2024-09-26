import { TokenRepository } from "../../../token";
import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { StudentObject } from "../../domain";
import {
	GetStudentProfileRequestDTO,
	GetStudentProfileResponseDTO,
	GetStudentProfileResponseDTOImpl
} from "../dto";
import { GetStudentProfileUseCase } from "./get-student-profile.use-case.type";




export class GetStudentProfileUseCaseImpl implements
	GetStudentProfileUseCase, StudentObject {
	private _unitOfWork: UnitOfWork;
	private _getStudentProfileRequestDTO: GetStudentProfileRequestDTO;
	private _getStudentProfileResponseDTO: GetStudentProfileResponseDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._getStudentProfileResponseDTO =
			new GetStudentProfileResponseDTOImpl();
	}

	set getStudentProfileRequestDTO(
		getStudentProfileRequestDTO: GetStudentProfileRequestDTO
	) {
		this._getStudentProfileRequestDTO = getStudentProfileRequestDTO;
	}

	async execute(): Promise<GetStudentProfileResponseDTO> {
		const tokenRepository = this._unitOfWork
			.getRepository("TokenRepository") as TokenRepository;

		const studentEntity = await tokenRepository
			.validateStudentAuthorizationToken(
				this._getStudentProfileRequestDTO.authorizationToken
			);

		this._getStudentProfileResponseDTO.email = studentEntity.email;
		this._getStudentProfileResponseDTO.firstName = studentEntity.firstName;
		this._getStudentProfileResponseDTO.id = studentEntity.id;
		this._getStudentProfileResponseDTO.lastName = studentEntity.lastName;
		this._getStudentProfileResponseDTO.profilePicture = 
			studentEntity.profilePicture;

		return this._getStudentProfileResponseDTO;
	}
}