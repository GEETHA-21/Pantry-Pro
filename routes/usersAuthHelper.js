//
// A helper middleware function for user authentification
//

module.exports = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error_msg", "Not Authorized");
	// res.redirect("/users/login");
	return next();
};