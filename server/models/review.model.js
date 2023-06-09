module.exports = (sequelize, Sequelize) => {
  const Review = sequelize.define(
    "review",
    {
      star: {
        type: Sequelize.ENUM,
        values: ["1", "2", "3", "4", "5"],
        defaultValue: "1",
      },
      comment: {
        type: Sequelize.STRING,
      },
    },
    {}
  );

  return Review;
};
