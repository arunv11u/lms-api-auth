
interface UploadStudentProfilePictureFieldsResponseDTO {
	key: string;
	bucket: string;
	"X-Amz-Algorithm": string;
	"X-Amz-Credential": string;
	"X-Amz-Date": string;
	Policy: string;
	"X-Amz-Signature": string;
}

interface UploadStudentProfilePictureResponseDTO {
	url: string;
	fields: UploadStudentProfilePictureFieldsResponseDTO;
}

export {
	UploadStudentProfilePictureFieldsResponseDTO,
	UploadStudentProfilePictureResponseDTO
};