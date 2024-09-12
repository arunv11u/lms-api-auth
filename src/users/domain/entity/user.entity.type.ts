

enum UserRoles {
	instructor = "INSTRUCTOR",
	student = "STUDENT"
}

abstract class UserEntity {
	abstract get id(): string;
	abstract set id(id: string);

	abstract get name(): string;
	abstract set name(name: string);

	abstract get email(): string;
	abstract set email(email: string);

	abstract get role(): UserRoles[];
	abstract set role(role: UserRoles[]);
}

export {
	UserRoles,
	UserEntity
};