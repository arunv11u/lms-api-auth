import { MimeTypes } from "../../../../utils";
import { UploadInstructorProfilePictureRequestDTO } from "./upload-instructor-profile-picture.request.dto.type";


class UploadInstructorProfilePictureRequestDTOImpl implements
	UploadInstructorProfilePictureRequestDTO {
	authorizationToken: string;
	mimeType: MimeTypes;
}

export {
	UploadInstructorProfilePictureRequestDTOImpl
};