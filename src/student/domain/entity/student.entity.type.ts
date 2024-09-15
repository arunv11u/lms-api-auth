

abstract class StudentEntity {
	abstract get id(): string;
	abstract set id(id: string);

	abstract get firstName(): string;
	abstract set firstName(firstName: string);

	abstract get lastName(): string;
	abstract set lastName(lastName: string);

	abstract get email(): string;
	abstract set email(email: string);

	abstract get password(): string;
	abstract set password(password: string);
}

export {
	StudentEntity
};