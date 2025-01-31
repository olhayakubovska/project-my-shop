export const hasRole = (array) => {
  return (req, res, next) => {
    const userRole = req.user.roleId;

    if (!array.includes(userRole)) {
      res.send({ error: "Доступ запрещен" });

      return;
    }

    next();
  };
};
