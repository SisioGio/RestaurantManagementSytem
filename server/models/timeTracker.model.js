module.exports = (sequelize, Sequelize) => {
  const TimeTracker = sequelize.define(
    "timeTracker",
    {
      activity: {
        type: Sequelize.ENUM,
        values: ["IN", "OUT"],
      },
    },
    {}
  );

  return TimeTracker;
};
