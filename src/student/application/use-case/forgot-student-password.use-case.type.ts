import { UseCase } from "../../../utils";
import { ForgotStudentPasswordRequestDTO } from "../dto";


export abstract class ForgotStudentPasswordUseCase implements UseCase {
	abstract set forgotStudentPasswordRequestDTO(
		forgotStudentPasswordRequestDTO: ForgotStudentPasswordRequestDTO
	);

	abstract execute(): Promise<void>;
}