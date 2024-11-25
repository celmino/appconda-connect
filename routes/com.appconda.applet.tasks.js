import babel from "@babel/core";
import jsxToJsonPlugin from "../babel-plugin-jsx-to-json.js";
import fs from "node:fs";
import jsxToSchemaPlugin from "babel-plugin-jsx-to-schema";
import path from "node:path";
import handlebars from "handlebars";
import { Client, Databases } from '@appconda/node'

const loadTemplate = (filePath) => {
    return fs.readFileSync(filePath, "utf-8");
};

export default function tasksRoutes(app, addon) {
    // Redirect root path to /atlassian-connect.json,
    // which will be served by atlassian-connect-express.

    app.get("/com.appconda.applet.tasks/:appletId/tasks", (req, res) => {
        res.send('Hello World');
    });

    app.post("/com.appconda.applet.tasks/install", (req, res) => {
        const client = new Client();
        client.setEndpoint('http://localhost/v1');
        client.setProject(req.headers['x-appconda-project'])
        client.setFallbackCookies(req.headers['x-fallback-cookies']);
        console.log(req.headers)

         const databases = new Databases(client);
        databases.createDocument('workspace','installedApps', 'unique()',{
            appId: 'hfjhfd',
            appName:'sddssdsd'
        }) 
        
        res.json({ installed: true })
    });

    app.get("/com.appconda.applet.tasks/node-schema", (req, res) => {
        res.json({
            kind: 'default',
            name: 'Task Applet',

            inputs: [
                {
                    name: 'IUsers',
                    id: 'users',
                    valueType: 'IUsers',
                },
                {
                    name: 'IPositions',
                    id: 'positions',
                    valueType: 'IPositions',
                },
                {
                    name: 'IEmail',
                    id: 'email',
                    valueType: 'IEmail',
                },
            ],
            outputs: [
                {
                    name: 'ITasks',
                    id: 'tasks',
                    valueType: 'ITasks',
                },
                {
                    name: 'IKPIs',
                    id: 'kpis',
                    valueType: 'IKPIs',
                }

            ],
        },)
    });
}
