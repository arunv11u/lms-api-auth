
interface UploadInstructorProfilePictureFieldsResponseDTO {
	key: string;
	bucket: string;
	"X-Amz-Algorithm": string;
	"X-Amz-Credential": string;
	"X-Amz-Date": string;
	Policy: string;
	"X-Amz-Signature": string;
}

interface UploadInstructorProfilePictureResponseDTO {
	url: string;
	fields: UploadInstructorProfilePictureFieldsResponseDTO;
}

export {
	UploadInstructorProfilePictureFieldsResponseDTO,
	UploadInstructorProfilePictureResponseDTO
};