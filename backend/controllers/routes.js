const routesRouter = require("express").Router();
const helpers = require("./helpers");
const Wall = require("../models/Wall");
const Route = require("../models/Route");
const { findByIdAndUpdate } = require("../models/Wall");

/*

GET /:id              BY ID one
GET /wall/:wallid     BY WALLID many
POST /:wallid         newROUTE
PUT /id               modify one
DELETE :WALLID/:ID    delete one

*/

routesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const route = await Route.findById(id);

  if (!route) return res.status(404).json({ error: "Invalid id" });

  return res.status(200).json(route.toJSON());
});

routesRouter.get("/wall/:wallId", async (req, res) => {
  const { wallId } = req.params;

  const routes = await Route.find({ wallId });
  if (!routes) return res.status(404).json({ error: "No routes found" });

  return res.status(200).json(routes.map((route) => route.toJSON()));
});

routesRouter.post("/wall/:wallId", async (req, res) => {
  const { wallId } = req.params;
  const { name, grade, user, description, holds } = req.body;

  if (holds.length === 0) return res.status(404).json({ error: 'invalid route holds'});
  const wall = await Wall.findById(wallId);
  if (!wall) return res.status(404).json({ error: "Invalid wall" });

  console.log("USER", user);
  const route = new Route({
    wallId,
    name,
    grade,
    user,
    description,
    holds,
  });

  console.log("Creating route", route);
  console.log("parameters", name, grade, user, description, holds);

  try {
    const newRoute = await route.save();
    return res.status(201).json(newRoute.toJSON());
  } catch (error) {
    return res.status(400).json({ error });
  }
});

routesRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, grade, user, description, holds } = req.body;
  const route = await Route.findById(id);

  if (!route) return res.status(404).json({ error: "Route not found" });

  helpers.updateDocumentValues(route, {
    name,
    grade,
    user,
    description,
    holds,
  });
  const updatedRoute = await route.save();
  return res.status(200).json(updatedRoute.toJSON());
});

routesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const deletedRoute = await Route.findByIdAndDelete(id);

  if (!deletedRoute)
    return res.status(404).json({ error: "Problems removing find" });

  return res.status(200).json(deletedRoute.toJSON());
});

module.exports = routesRouter;
