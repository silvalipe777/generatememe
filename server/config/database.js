const { Sequelize } = require('sequelize');

let sequelize;

const connectDB = async () => {
  try {
    sequelize = new Sequelize(process.env.DATABASE_URL || process.env.POSTGRES_URI, {
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      logging: false
    });

    await sequelize.authenticate();
    console.log('PostgreSQL conectado com sucesso!');

    // Sincronizar modelos com o banco de dados
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Modelos sincronizados!');
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error.message);
    process.exit(1);
  }
};

const getSequelize = () => sequelize;

module.exports = { connectDB, getSequelize };
