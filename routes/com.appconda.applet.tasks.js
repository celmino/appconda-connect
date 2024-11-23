import babel from "@babel/core";
import jsxToJsonPlugin from "../babel-plugin-jsx-to-json.js";
import fs from "node:fs";
import jsxToSchemaPlugin from "babel-plugin-jsx-to-schema";
import path from "node:path";
import handlebars from "handlebars";
import { Client, Applets } from '@appconda/node'

const loadTemplate = (filePath) => {
    return fs.readFileSync(filePath, "utf-8");
};

export default function tasksRoutes(app, addon) {
    // Redirect root path to /atlassian-connect.json,
    // which will be served by atlassian-connect-express.

    app.get("/com.appconda.applet.tasks/:appletId/tasks", (req, res) => {
        res.send('Hello World');
    });
}
