import { TokenRepository } from "../../../token";
import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { InstructorObject, InstructorRepository } from "../../domain";
import {
	UploadInstructorProfilePictureRequestDTO,
	UploadInstructorProfilePictureResponseDTO,
	UploadInstructorProfilePictureResponseDTOImpl
} from "../dto";
import { UploadInstructorProfilePictureUseCase } from "./upload-instructor-profile-picture.use-case.type";




export class UploadInstructorProfilePictureUseCaseImpl implements
	UploadInstructorProfilePictureUseCase, InstructorObject {
	private _unitOfWork: UnitOfWork;
	private _uploadInstructorProfilePictureRequestDTO:
		UploadInstructorProfilePictureRequestDTO;
	private _uploadInstructorProfilePictureResponseDTO:
		UploadInstructorProfilePictureResponseDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
		this._uploadInstructorProfilePictureResponseDTO =
			new UploadInstructorProfilePictureResponseDTOImpl();
	}

	set uploadInstructorProfilePictureRequestDTO(
		uploadInstructorProfilePictureRequestDTO:
			UploadInstructorProfilePictureRequestDTO
	) {
		this._uploadInstructorProfilePictureRequestDTO =
			uploadInstructorProfilePictureRequestDTO;
	}

	async execute(): Promise<UploadInstructorProfilePictureResponseDTO> {
		const tokenRepository = this._unitOfWork
			.getRepository("TokenRepository") as TokenRepository;
		const instructorRepository = this._unitOfWork
			.getRepository("InstructorRepository") as InstructorRepository;

		const instructorEntity = await tokenRepository
			.validateInstructorAuthorizationToken(
				this._uploadInstructorProfilePictureRequestDTO
					.authorizationToken
			);

		const uploadPreSignedURLResponse = await instructorRepository
			.uploadInstructorProfilePicture(
				instructorEntity.id,
				this._uploadInstructorProfilePictureRequestDTO.mimeType
			);

		this._uploadInstructorProfilePictureResponseDTO.url =
			uploadPreSignedURLResponse.url;
		this._uploadInstructorProfilePictureResponseDTO.fields.Policy =
			uploadPreSignedURLResponse.fields.Policy;
		this._uploadInstructorProfilePictureResponseDTO.fields["X-Amz-Algorithm"] =
			uploadPreSignedURLResponse.fields["X-Amz-Algorithm"];
		this._uploadInstructorProfilePictureResponseDTO.fields["X-Amz-Credential"] =
			uploadPreSignedURLResponse.fields["X-Amz-Credential"];
		this._uploadInstructorProfilePictureResponseDTO.fields["X-Amz-Date"] =
			uploadPreSignedURLResponse.fields["X-Amz-Date"];
		this._uploadInstructorProfilePictureResponseDTO.fields["X-Amz-Signature"] =
			uploadPreSignedURLResponse.fields["X-Amz-Signature"];
		this._uploadInstructorProfilePictureResponseDTO.fields.bucket =
			uploadPreSignedURLResponse.fields.bucket;
		this._uploadInstructorProfilePictureResponseDTO.fields.key =
			uploadPreSignedURLResponse.fields.key;

		return this._uploadInstructorProfilePictureResponseDTO;
	}
}