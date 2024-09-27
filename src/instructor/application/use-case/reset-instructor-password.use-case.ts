import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { InstructorObject, InstructorRepository } from "../../domain";
import { ResetInstructorPasswordRequestDTO } from "../dto";
import { ResetInstructorPasswordUseCase } from "./reset-instructor-password.use-case.type";



export class ResetInstructorPasswordUseCaseImpl implements
	ResetInstructorPasswordUseCase, InstructorObject {
	private _unitOfWork: UnitOfWork;
	private _resetInstructorPasswordRequestDTO:
		ResetInstructorPasswordRequestDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
	}

	set resetInstructorPasswordRequestDTO(
		resetInstructorPasswordRequestDTO: ResetInstructorPasswordRequestDTO
	) {
		this._resetInstructorPasswordRequestDTO =
			resetInstructorPasswordRequestDTO;
	}

	async execute(): Promise<void> {
		try {
			await this._unitOfWork.start();
			const instructorRepository = this._unitOfWork.getRepository("InstructorRepository") as InstructorRepository;

			await instructorRepository.resetInstructorPassword(
				this._resetInstructorPasswordRequestDTO.email,
				this._resetInstructorPasswordRequestDTO.verificationCode,
				this._resetInstructorPasswordRequestDTO.password
			);

			await this._unitOfWork.complete();
		} catch (error) {
			await this._unitOfWork.dispose();

			throw error;
		}
	}
}