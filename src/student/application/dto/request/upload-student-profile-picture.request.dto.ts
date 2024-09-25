import { MimeTypes } from "../../../../utils";
import { UploadStudentProfilePictureRequestDTO } from "./upload-student-profile-picture.request.dto.type";


class UploadStudentProfilePictureRequestDTOImpl implements
	UploadStudentProfilePictureRequestDTO {
	authorizationToken: string;
	mimeType: MimeTypes;
}

export {
	UploadStudentProfilePictureRequestDTOImpl
};