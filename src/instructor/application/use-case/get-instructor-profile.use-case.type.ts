import { UseCase } from "../../../utils";
import { GetInstructorProfileRequestDTO, GetInstructorProfileResponseDTO } from "../dto";


export abstract class GetInstructorProfileUseCase implements UseCase {
	abstract set getInstructorProfileRequestDTO(
		getInstructorProfileRequestDTO: GetInstructorProfileRequestDTO
	);

	abstract execute(): Promise<GetInstructorProfileResponseDTO>;
}