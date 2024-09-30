import { TokenRepository } from "../../../token";
import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { StudentObject, StudentRepository } from "../../domain";
import {
	UploadStudentProfilePictureRequestDTO,
	UploadStudentProfilePictureResponseDTO,
	UploadStudentProfilePictureResponseDTOImpl
} from "../dto";
import { UploadStudentProfilePictureUseCase } from "./upload-student-profile-picture.use-case.type";




export class UploadStudentProfilePictureUseCaseImpl implements
	UploadStudentProfilePictureUseCase, StudentObject {
	private _unitOfWork: UnitOfWork;
	private _uploadStudentProfilePictureRequestDTO:
		UploadStudentProfilePictureRequestDTO;
	private _uploadStudentProfilePictureResponseDTO:
		UploadStudentProfilePictureResponseDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._uploadStudentProfilePictureResponseDTO =
			new UploadStudentProfilePictureResponseDTOImpl();
	}

	set uploadStudentProfilePictureRequestDTO(
		uploadStudentProfilePictureRequestDTO:
			UploadStudentProfilePictureRequestDTO
	) {
		this._uploadStudentProfilePictureRequestDTO =
			uploadStudentProfilePictureRequestDTO;
	}

	async execute(): Promise<UploadStudentProfilePictureResponseDTO> {
		const tokenRepository = this._unitOfWork
			.getRepository("TokenRepository") as TokenRepository;
		const studentRepository = this._unitOfWork
			.getRepository("StudentRepository") as StudentRepository;

		const studentEntity = await tokenRepository
			.validateStudentAuthorizationToken(
				this._uploadStudentProfilePictureRequestDTO.authorizationToken
			);

		const uploadPreSignedURLResponse = await studentRepository
			.uploadStudentProfilePicture(
				studentEntity.id,
				this._uploadStudentProfilePictureRequestDTO.mimeType
			);

		this._uploadStudentProfilePictureResponseDTO.url =
			uploadPreSignedURLResponse.url;
		this._uploadStudentProfilePictureResponseDTO.fields.Policy =
			uploadPreSignedURLResponse.fields.Policy;
		this._uploadStudentProfilePictureResponseDTO.fields["X-Amz-Algorithm"] =
			uploadPreSignedURLResponse.fields["X-Amz-Algorithm"];
		this._uploadStudentProfilePictureResponseDTO.fields["X-Amz-Credential"] =
			uploadPreSignedURLResponse.fields["X-Amz-Credential"];
		this._uploadStudentProfilePictureResponseDTO.fields["X-Amz-Date"] =
			uploadPreSignedURLResponse.fields["X-Amz-Date"];
		this._uploadStudentProfilePictureResponseDTO.fields["X-Amz-Signature"] =
			uploadPreSignedURLResponse.fields["X-Amz-Signature"];
		this._uploadStudentProfilePictureResponseDTO.fields.bucket =
			uploadPreSignedURLResponse.fields.bucket;
		this._uploadStudentProfilePictureResponseDTO.fields.key =
			uploadPreSignedURLResponse.fields.key;

		return this._uploadStudentProfilePictureResponseDTO;
	}
}