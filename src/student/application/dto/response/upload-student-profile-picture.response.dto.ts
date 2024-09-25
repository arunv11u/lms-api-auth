/* eslint-disable max-classes-per-file */
import { UploadStudentProfilePictureFieldsResponseDTO, UploadStudentProfilePictureResponseDTO } from "./upload-student-profile-picture.response.dto.type";

class UploadStudentProfilePictureFieldsResponseDTOImpl implements
	UploadStudentProfilePictureFieldsResponseDTO {
	key: string;
	bucket: string;
	"X-Amz-Algorithm": string;
	"X-Amz-Credential": string;
	"X-Amz-Date": string;
	Policy: string;
	"X-Amz-Signature": string;
}

class UploadStudentProfilePictureResponseDTOImpl implements
	UploadStudentProfilePictureResponseDTO {
	url: string;
	fields = new UploadStudentProfilePictureFieldsResponseDTOImpl();
}

export {
	UploadStudentProfilePictureResponseDTOImpl
};