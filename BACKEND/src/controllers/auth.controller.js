
function getMeController(req, res) {
  res.status(200).json({
    message: "user details fetched successfully",
    user: {
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.displayName,
      photoURL: req.user.photoURL,
    },
  });
}

module.exports = { getMeController };



