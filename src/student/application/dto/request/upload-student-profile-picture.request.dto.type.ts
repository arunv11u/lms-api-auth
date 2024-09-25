import { MimeTypes } from "../../../../utils";


interface UploadStudentProfilePictureRequestDTO {
	authorizationToken: string;
	mimeType: MimeTypes
}

export {
	UploadStudentProfilePictureRequestDTO
};