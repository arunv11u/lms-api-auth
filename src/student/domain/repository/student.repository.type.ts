import { Repository, UploadPreSignedURLResponse } from "../../../utils";
import { StudentEntity } from "../entity";


export abstract class StudentRepository extends Repository {
	abstract getId(): string;
	abstract getUserIdWithStudentId(id: string): Promise<string>;
	abstract register(student: StudentEntity): Promise<StudentEntity>;
	abstract signInWithEmail(
		email: string,
		password: string
	): Promise<{ isValidCredentials: boolean }>;
	abstract getUserWithEmail(email: string): Promise<StudentEntity>;
	abstract registerStudentWithGoogleOAuth(
		authCode: string,
		redirectUri: string
	): Promise<StudentEntity>;
	abstract forgotStudentPassword(
		email: string
	): Promise<void>;
	abstract resetStudentPassword(
		email: string,
		verificationCode: string,
		password: string
	): Promise<void>;
	abstract getStudentProfileById(
		id: string
	): Promise<StudentEntity>;
	abstract getStudentProfileByUserId(
		userId: string
	): Promise<StudentEntity>;
	abstract changeStudentPassword(
		id: string,
		password: string
	): Promise<void>;
	abstract uploadStudentProfilePicture(
		id: string,
		mimeType: string
	): Promise<UploadPreSignedURLResponse>;
	abstract updateStudentProfile(
		student: StudentEntity
	): Promise<StudentEntity>;
}