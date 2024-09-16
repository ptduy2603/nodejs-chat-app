class authController {
  //[GET] : auth
  greeting(req, res) {
    res.json({ Message: "Hello you guys" });
  }
}

module.exports = new authController();
