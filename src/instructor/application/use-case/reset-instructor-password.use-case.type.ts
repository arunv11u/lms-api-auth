import { UseCase } from "../../../utils";
import { ResetInstructorPasswordRequestDTO } from "../dto";


export abstract class ResetInstructorPasswordUseCase implements UseCase {
	abstract set resetInstructorPasswordRequestDTO(
		resetInstructorPasswordRequestDTO: ResetInstructorPasswordRequestDTO
	);

	abstract execute(): Promise<void>;
}