import { UnitOfWork, UnitOfWorkImpl } from "../../../utils";
import { StudentObject, StudentRepository } from "../../domain";
import { ResetStudentPasswordRequestDTO } from "../dto";
import { ResetStudentPasswordUseCase } from "./reset-student-password.use-case.type";




export class ResetStudentPasswordUseCaseImpl implements
	ResetStudentPasswordUseCase, StudentObject {
	private _unitOfWork: UnitOfWork;
	private _resetStudentPasswordRequestDTO: ResetStudentPasswordRequestDTO;

	constructor() {
		this._unitOfWork = new UnitOfWorkImpl();
	}

	set resetStudentPasswordRequestDTO(
		resetStudentPasswordRequestDTO: ResetStudentPasswordRequestDTO
	) {
		this._resetStudentPasswordRequestDTO = resetStudentPasswordRequestDTO;
	}

	async execute(): Promise<void> {
		try {
			await this._unitOfWork.start();
			const studentRepository = this._unitOfWork.getRepository("StudentRepository") as StudentRepository;

			await studentRepository.resetStudentPassword(
				this._resetStudentPasswordRequestDTO.email,
				this._resetStudentPasswordRequestDTO.verificationCode,
				this._resetStudentPasswordRequestDTO.password
			);

			await this._unitOfWork.complete();
		} catch (error) {
			await this._unitOfWork.dispose();

			throw error;
		}
	}
}