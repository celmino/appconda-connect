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

export default function routes(app, addon) {
  // Redirect root path to /atlassian-connect.json,
  // which will be served by atlassian-connect-express.

  app.get("/", (req, res) => {
    res.redirect("/App1.json");
  });

  app.get("/applet/:appletName", (req, res) => {
    //const file = fs.readFileSync(path.resolve('./public/remote/index.js'), "utf-8");
    res.sendFile(path.resolve(`./applets/${req.params.appletName}/applet.js`))
  });

  app.get("/applet/:appletName/menu", (req, res) => {
    //const file = fs.readFileSync(path.resolve('./public/remote/index.js'), "utf-8");
    const menu = fs.readFileSync(path.resolve(`./applets/${req.params.appletName}/menu.json`), "utf-8");
    res.json(JSON.parse(menu));
  });

  app.get("/appstore", (req, res) => {

    const client = new Client();
    client.setEndpoint('http://localhost/v1');
    client.setFallbackCookies(req.headers['x-fallback-cookies']);


    //const applets = new Applets(client);
    //applets.getAppletScript('com.com.com');

    const appletFolders = fs.readdirSync(path.resolve('./applets'));
    const applets= [];
    appletFolders.forEach(function (file, index) {

        if (true) {
            // Make one pass and make the file complete
            var fromPath = path.join(path.resolve('./applets'), file);

            const stat = fs.statSync(fromPath);

            if (stat.isDirectory()) {
             const manifestPath =path.resolve(fromPath + '/manifest.json');
             const manifestString = fs.readFileSync(manifestPath, "utf-8");
             const manifestObject = JSON.parse(manifestString);
             // applets.push(require(path.resolve(fromPath + '/manifest.json')));
                //const service = require(path.resolve(fromPath));
                //container.registerService(null, service);

                applets.push(manifestObject);

            }

          
        }
    });

    res.json(applets);
  });

  // This is an example route used by "generalPages" module (see atlassian-connect.json).
  // Verify that the incoming request is authenticated with Atlassian Connect.
  app.get("/hello-world", (req, res) => {
    // Rendering a template is easy; the render method takes two params: the name of the component or template file, and its props.
    // Handlebars and jsx are both supported, but please note that jsx changes require `npm run watch-jsx` in order to be picked up by the server.
    res.render(
      "hello-world.hbs", // change this to 'hello-world.jsx' to use the Atlaskit & React version
      {
        title: "Atlassian Connect",
        //, issueId: req.query['issueId']
        //, browserOnly: true // you can set this to disable server-side rendering for react views
      }
    );
  });

  app.get("/transform/:view", (req, res) => {
    try {
      const indexTemplate = loadTemplate(`./views/${req.params.view}.jsx`);
      const index = handlebars.compile(indexTemplate);
      const content = index({
        title: "Atlassian Connect",
        people: [
          { name: "Yehuda Katz" },
          { name: "Alan Johnson" },
          { name: "Charles Jolley" },
        ],
        //, issueId: req.query['issueId']
        //, browserOnly: true // you can set this to disable server-side rendering for react views
      });


      // JSX'i JSON'a dönüştürmek için Babel transform işlemi
      const result = babel.transformSync(content, {
        plugins: [jsxToSchemaPlugin],
        presets: ["@babel/preset-react"],
        filename: "example.jsx", // Dosya adını belirterek hata ayıklamayı kolaylaştırır
      });

      // Dönüşüm sonucu elde edilen kodu JSON formatında geri gönder
      res.json(eval(result.code)); // `eval` ile JSON çıktısını yürütüyoruz
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add additional route handlers here...
}
