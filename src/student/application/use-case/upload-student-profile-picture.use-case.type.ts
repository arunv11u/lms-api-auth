import { UseCase } from "../../../utils";
import {
	UploadStudentProfilePictureRequestDTO,
	UploadStudentProfilePictureResponseDTO
} from "../dto";


export abstract class UploadStudentProfilePictureUseCase implements UseCase {
	abstract set uploadStudentProfilePictureRequestDTO(
		uploadStudentProfilePictureRequestDTO:
			UploadStudentProfilePictureRequestDTO
	);

	abstract execute(): Promise<UploadStudentProfilePictureResponseDTO>;
}