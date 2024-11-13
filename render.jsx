import React from 'react';

interface ComponentSchema {
  component: string;
  props: { [key: string]: any } | null;
  children: (ComponentSchema | string)[];
}

const renderComponent = (schema: ComponentSchema): React.ReactNode => {
  const { component, props, children } = schema;

  const Component = component === 'Space' ? 'div' : component; // Özel bileşenler için ayarlama

  return React.createElement(
    Component,
    props,
    children.map((child, index) =>
      typeof child === 'string' ? child : renderComponent(child)
    )
  );
};

const schema: ComponentSchema = {
  component: "div",
  props: {
    className: "container",
    id: "main"
  },
  children: [
    {
      component: "span",
      props: {
        data_text: "Hello World"
      },
      children: []
    },
    {
      component: "span",
      props: {
        data_text: "Example Text"
      },
      children: []
    },
    {
      component: "Space",
      props: null,
      children: [
        "Test"
      ]
    },
    {
      component: "Dialog",
      props: null,
      children: [
        {
          component: "AppCondaInput",
          props: {
            name: "test"
          },
          children: []
        }
      ]
    }
  ]
};

const App: React.FC = () => {
  return (
    <div>
      {renderComponent(schema)}
    </div>
  );
};

export default App;
