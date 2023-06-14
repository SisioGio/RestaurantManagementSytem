module.exports = (sequelize, Sequelize) => {
  const Review = sequelize.define(
    "review",
    {
      star: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: Sequelize.STRING,
      },
    },
    {}
  );

  return Review;
};
