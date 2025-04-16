import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Sessao from "./SessaoModel.js";
import Usuario from "./UsuarioModel.js";


const UsuarioSessao = sequelize.define(
    'usuarios_sessoes',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        valorAtual: {
            field: 'valor_atual',
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'create_at',
        updatedAt: 'updated_at',
    }
);

UsuarioSessao.belongsTo(Sessao, {
    as: 'sessao',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idSessao',
        allowNull: false,
        field: 'id_sessao'
    }
});

UsuarioSessao.belongsTo(Usuario, {
    as: 'usuario',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
        name: 'idUsuario',
        allowNull: false,
        field: 'id_usuario'
    }
});


export default UsuarioSessao;