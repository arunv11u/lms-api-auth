/* eslint-disable max-classes-per-file */
import {
	UploadInstructorProfilePictureFieldsResponseDTO,
	UploadInstructorProfilePictureResponseDTO
} from "./upload-instructor-profile-picture.response.dto.type";

class UploadInstructorProfilePictureFieldsResponseDTOImpl implements
	UploadInstructorProfilePictureFieldsResponseDTO {
	key: string;
	bucket: string;
	"X-Amz-Algorithm": string;
	"X-Amz-Credential": string;
	"X-Amz-Date": string;
	Policy: string;
	"X-Amz-Signature": string;
}

class UploadInstructorProfilePictureResponseDTOImpl implements
	UploadInstructorProfilePictureResponseDTO {
	url: string;
	fields = new UploadInstructorProfilePictureFieldsResponseDTOImpl();
}

export {
	UploadInstructorProfilePictureResponseDTOImpl
};