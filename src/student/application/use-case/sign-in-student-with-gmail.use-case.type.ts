import { UseCase } from "../../../utils";
import { SignInStudentWithGmailRequestDTO, SignInStudentWithGmailResponseDTO } from "../dto";


export abstract class SignInStudentWithGmailUseCase implements UseCase {
	abstract set signInStudentWithGmailRequestDTO(
		signInStudentWithGmailRequestDTO: SignInStudentWithGmailRequestDTO
	);

	abstract execute(): Promise<SignInStudentWithGmailResponseDTO>;
}