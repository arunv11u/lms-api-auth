import { UseCase } from "../../../utils";
import { UploadStudentProfilePictureRequestDTO } from "../dto";
import { UploadStudentProfilePictureResponseDTO } from "../dto/response/upload-student-profile-picture.response.dto.type";


export abstract class UploadStudentProfilePictureUseCase implements UseCase {
	abstract set uploadStudentProfilePictureRequestDTO(
		uploadStudentProfilePictureRequestDTO:
			UploadStudentProfilePictureRequestDTO
	);

	abstract execute(): Promise<UploadStudentProfilePictureResponseDTO>;
}