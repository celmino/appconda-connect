export default function jsxToJsonPlugin({ types: t }) {
    return {
      visitor: {
        JSXElement(path) {
          const openingElement = path.node.openingElement;
          const elementName = openingElement.name.name;
  
          // JSX props'u JSON formatına çevir
          const attributes = openingElement.attributes.reduce((acc, attr) => {
            const attrName = attr.name.name;
            const attrValue = attr.value.value || ""; // null değerleri ele al
            acc[attrName] = attrValue;
            return acc;
          }, {});
  
          // Çocuk elemanları JSON formatında çevir
          const children = path.node.children
            .filter(child => t.isJSXText(child) || t.isJSXElement(child))
            .map(child => {
              if (t.isJSXText(child)) {
                return child.value.trim(); // metin düğümleri
              } else {
                return {}; // Alt JSX elemanları işlenebilir
              }
            });
  
          // JSON yapısını oluştur
          const jsonObject = t.objectExpression([
            t.objectProperty(t.identifier("type"), t.stringLiteral(elementName)),
            t.objectProperty(t.identifier("props"), t.valueToNode(attributes)),
            t.objectProperty(t.identifier("children"), t.valueToNode(children))
          ]);
  
          // JSX düğümünü JSON yapısı ile değiştir
          path.replaceWith(jsonObject);
        }
      }
    };
  };
  