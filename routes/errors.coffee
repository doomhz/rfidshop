module.exports = (app)->
  
  app.use (req, res)->
    return res.render "site/index"
    title = "Page not found"
    description = "Page not found"
    res.statusCode = 404
    if req.accepts "html"
      return res.render "errors/404",
        title: "Page not found"
        description: description
    if req.accepts "json"
      return res.send
        error: "Not found"
    res.type("txt").send("Not found")
