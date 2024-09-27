import { UseCase } from "../../../utils";
import { ForgotInstructorPasswordRequestDTO } from "../dto";


export abstract class ForgotInstructorPasswordUseCase implements UseCase {
	abstract set forgotInstructorPasswordRequestDTO(
		forgotInstructorPasswordRequestDTO: ForgotInstructorPasswordRequestDTO
	);

	abstract execute(): Promise<void>;
}