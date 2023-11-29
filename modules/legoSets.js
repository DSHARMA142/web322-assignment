

require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });


const Theme = sequelize.define('Theme',
	 {
	  id: {
	    type:  Sequelize.INTEGER,
	    primaryKey: true,
	    autoIncrement: true, 
	  },
	  name: Sequelize.STRING,
	},
	  {
	    createdAt: false,
	    updatedAt: false, 
	  }
	);
	const Set = sequelize.define('Set', 
	{
	  set_num: {
	    type: Sequelize.STRING,
	    primaryKey: true,
	  },
	  name: Sequelize.STRING,
	  year: Sequelize.INTEGER,
	  num_parts: Sequelize.INTEGER,
	  theme_id: Sequelize.INTEGER, 
	  img_url: Sequelize.STRING,
	},
   {
	  createdAt: false,
	  updatedAt: false,
  } 
	);
	
 Set.belongsTo(Theme, {foreignKey: 'theme_id'})
 async function initialize() {
  try {
    await sequelize.sync();
  } catch (err) {
    throw err;
  }
}

async function getAllSets() {
  try {
    return await Set.findAll({ include: [Theme] });
  } catch (error) {
    throw error;
  }
}

async function getSetByNum(setNum) {
  try {
    const set = await Set.findOne({
      where: { set_num: setNum },
      include: [Theme],
    });

    if (set) {
      return set;
    } else {
      throw new Error('Unable to find requested set');
    }
  } catch (error) {
    throw error;
  }
}

async function getSetsByTheme(theme) {
  try {
    const sets = await Set.findAll({
      include: [Theme],
      where: {
        '$Theme.name$': {
          [Sequelize.Op.iLike]: `%${theme}%`,
        },
      },
    });

    if (sets.length > 0) {
      return sets;
    } else {
      throw new Error('Unable to find requested sets');
    }
  } catch (error) {
    throw error;
  }
}

async function addSet(setData) {
  try {
    await Set.create(setData);
  } catch (error) {
    throw error;
  }
}

async function getAllThemes() {
  try {
    return await Theme.findAll();
  } catch (error) {
    throw error;
  }
}

async function editSet(setNum, setData) {
  try {
    await Set.update(setData, {
      where: { set_num: setNum },
    });
  } catch (error) {
    throw (
      error.errors && error.errors.length > 0
        ? error.errors[0].message
        : 'An error occurred while updating the set.'
    );
  }
}

async function deleteSet(setNum) {
  try {
    await Set.destroy({
      where: { set_num: setNum },
    });
  } catch (error) {
    throw (
      error.errors && error.errors.length > 0
        ? error.errors[0].message
        : 'An error occurred while deleting the set.'
    );
  }
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme,getAllThemes,deleteSet};

