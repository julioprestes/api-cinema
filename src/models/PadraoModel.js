import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const PadraoLugares = sequelize.define(
    'padrao_lugares',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        lugares: {
            type: DataTypes.JSONB,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'create_at',
        updatedAt: 'updated_at',
    }
);


export default PadraoLugares;