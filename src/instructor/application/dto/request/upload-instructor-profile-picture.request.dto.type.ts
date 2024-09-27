import { MimeTypes } from "../../../../utils";


interface UploadInstructorProfilePictureRequestDTO {
	authorizationToken: string;
	mimeType: MimeTypes
}

export {
	UploadInstructorProfilePictureRequestDTO
};