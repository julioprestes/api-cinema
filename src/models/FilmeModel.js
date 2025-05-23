import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Filme = sequelize.define(
    'filmes',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.TEXT,
        },
        autor: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        duracao: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        imagemLink: {
            field: 'imagem-link',
            type: DataTypes.TEXT
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'create_at',
        updatedAt: 'updated_at',
    }
);


export default Filme;