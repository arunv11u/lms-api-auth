import { UseCase } from "../../../utils";
import { 
	UploadInstructorProfilePictureRequestDTO, 
	UploadInstructorProfilePictureResponseDTO 
} from "../dto";


export abstract class UploadInstructorProfilePictureUseCase implements UseCase {
	abstract set uploadInstructorProfilePictureRequestDTO(
		uploadInstructorProfilePictureRequestDTO:
			UploadInstructorProfilePictureRequestDTO
	);

	abstract execute(): Promise<UploadInstructorProfilePictureResponseDTO>;
}