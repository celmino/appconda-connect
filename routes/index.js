import babel from "@babel/core";
import jsxToJsonPlugin from "../babel-plugin-jsx-to-json.js";
import fs from "node:fs";
import jsxToSchemaPlugin from "babel-plugin-jsx-to-schema";
import path from "node:path";
import handlebars from "handlebars";

const loadTemplate = (filePath) => {
  return fs.readFileSync(filePath, "utf-8");
};

export default function routes(app, addon) {
  // Redirect root path to /atlassian-connect.json,
  // which will be served by atlassian-connect-express.

  app.get("/", (req, res) => {
    res.redirect("/App1.json");
  });

  app.get("/appstore", (req, res) => {
    res.json([
      {
        name: "Portal",
        url: "/tasks.json",
      },
      {
        name: "Companies",
        url: "/tasks.json",
      },
      {
        name: "Tasks",
        url: "/tasks.json",
      },
      {
        name: "Process",
        url: "/process.json",
      },
      {
        name: "Content Management",
        url: "/process.json",
      },
      {
        name: "Documents",
        url: "/process.json",
      },
      {
        name: "Customers",
        url: "/process.json",
      },
    ]);
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

  app.get("/transform", (req, res) => {
    try {
      const indexTemplate = loadTemplate("./example.jsx");
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

      // JSX dosyasını okuyun
      const jsxInput = fs.readFileSync("./example.jsx", "utf-8");
      
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
