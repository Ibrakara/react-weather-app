import React from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import router from "../src/routes/index.jsx";
import { store } from "../src/store/index.js";

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

jest.mock("react-redux", () => ({
  Provider: ({ children }) => <div>{children}</div>,
}));

jest.mock("react-router-dom", () => ({
  RouterProvider: ({ router }) => (
    <div>Mocked RouterProvider for {router.name}</div>
  ),
  createBrowserRouter: jest.fn(() => ({
    name: "mockRouter",
  })),
}));

jest.mock("@tanstack/react-query", () => ({
  QueryClientProvider: ({ children }) => <div>{children}</div>,
  QueryClient: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  Toaster: () => <div>Mocked Toaster</div>,
}));

describe("main.jsx", () => {
  let rootElement;

  beforeEach(() => {
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);

    createRoot.mockClear();
  });

  afterEach(() => {
    document.body.removeChild(rootElement);
  });

  test("renders the App into the root element", () => {
    require("./main.jsx");

    expect(createRoot).toHaveBeenCalledWith(rootElement);

    const mockRender = createRoot.mock.results[0].value.render;
    expect(mockRender).toHaveBeenCalledTimes(1);

    const renderCallArgs = mockRender.mock.calls[0][0];

    expect(renderCallArgs.type).toBe(React.StrictMode);

    expect(renderCallArgs.props.children.type).toBe(QueryClientProvider);

    expect(renderCallArgs.props.children.props.children.type).toBe(
      StoreProvider
    );

    const storeProviderChildren =
      renderCallArgs.props.children.props.children.props.children;
    expect(storeProviderChildren[0].type).toBe(RouterProvider);
    expect(storeProviderChildren[1].type).toBe(Toaster);

    expect(storeProviderChildren[0].props.router).toBe(router);
    expect(renderCallArgs.props.children.props.children.props.store).toBe(
      store
    );
  });
});
