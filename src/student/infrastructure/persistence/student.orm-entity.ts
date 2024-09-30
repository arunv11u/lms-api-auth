import { DataTypes, Model, Optional } from "sequelize";
import { postgresqlConnect } from "../../../utils";

enum StudentSignupMethods {
	emailPassword = "EMAIL_PASSWORD",
	googleOAuth = "GOOGLE_OAUTH"
}

class StudentORMEntity {
	id: string;
	user_id: string;
	first_name: string;
	last_name: string;
	profile_picture: string | null;
	email: string;
	password: string | null;
	signup_method: StudentSignupMethods;
	created_by: string;
	last_modified_by: string;
	created_at?: Date;
	last_modified_at?: Date;
	version: number;
}

interface StudentCreationAttributes extends Optional<StudentORMEntity, "id" | "created_at" | "last_modified_at"> { }

type Student = Model<StudentORMEntity, StudentCreationAttributes>;

function initializeStudentModel() {
	const sequelize = postgresqlConnect.postgresClient;

	sequelize.define<Student>("Student", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			}
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		profile_picture: {
			type: DataTypes.STRING,
			allowNull: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true
		},
		signup_method: {
			type: DataTypes.STRING,
			values: [
				StudentSignupMethods.emailPassword, 
				StudentSignupMethods.googleOAuth
			]
		},
		created_by: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			}
		},
		last_modified_by: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: "users",
				key: "id"
			}
		},
		version: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		tableName: "students",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "last_modified_at"
	});
}

function setupStudentAssociations() {
	const sequelize = postgresqlConnect.postgresClient;
	const Student = sequelize.models["Student"];
	const User = sequelize.models["User"];

	Student.belongsTo(User, {
		foreignKey: "user_id",
		as: "user"
	});

	Student.belongsTo(User, {
		foreignKey: "created_by",
		as: "creator"
	});

	Student.belongsTo(User, {
		foreignKey: "last_modified_by",
		as: "modifier"
	});
}


export {
	StudentSignupMethods,
	StudentORMEntity,
	StudentCreationAttributes,
	initializeStudentModel,
	setupStudentAssociations
};