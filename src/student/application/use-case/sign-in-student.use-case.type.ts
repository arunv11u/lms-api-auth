import { UseCase } from "../../../utils";
import { SignInStudentRequestDTO, SignInStudentResponseDTO } from "../dto";


export abstract class SignInStudentUseCase implements UseCase {
	abstract set signInStudentRequestDTO(
		signInStudentRequestDTO: SignInStudentRequestDTO
	);

	abstract execute(): Promise<SignInStudentResponseDTO>;
}