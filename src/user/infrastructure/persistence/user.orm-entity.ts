import { DataTypes, Model, Optional } from "sequelize";
import { postgresqlConnect } from "../../../utils";

enum UserTypes {
	student = "STUDENT",
	instructor = "INSTRUCTOR"
}

class UserORMEntity {
	id: string;
	type: UserTypes;
	created_by: string;
	last_modified_by: string;
	created_at?: Date;
	last_modified_at?: Date;
	version: number;
}

interface UserCreationAttributes extends Optional<UserORMEntity, "id" | "created_at" | "last_modified_at"> { }

type User = Model<UserORMEntity, UserCreationAttributes>;

function initializeUserModel() {
	const sequelize = postgresqlConnect.postgresClient;

	sequelize.define<User>("User", {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		type: {
			type: DataTypes.ENUM,
			values: ["STUDENT", "INSTRUCTOR"]
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
		tableName: "users",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "last_modified_at"
	});
}

function setupUserAssociations() {
	const sequelize = postgresqlConnect.postgresClient;
	const User = sequelize.models["User"];

	User.belongsTo(User, {
		foreignKey: "created_by",
		as: "creator"
	});

	User.belongsTo(User, {
		foreignKey: "last_modified_by",
		as: "modifier"
	});
}

export {
	UserTypes,
	UserORMEntity,
	UserCreationAttributes,
	initializeUserModel,
	setupUserAssociations
};