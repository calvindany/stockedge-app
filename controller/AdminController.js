exports.getDashboard = (req, res, next) => {
  let isAdmin = false;
  if (req.admin) {
    isAdmin = true;
  }
  res.render("admin/dashboard", {
    route: "/dashboard",
    isAdmin: isAdmin,
  });
};

exports.getBarang = (req, res, next) => {
  res.render("admin/barang", {
    route: "/barang",
  });
};