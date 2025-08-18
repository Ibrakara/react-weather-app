import { createBrowserRouter } from "react-router-dom";
import router from "@src/routes/index.jsx";

jest.mock(
  "@src/App",
  () =>
    function App() {
      return <div>Mocked App</div>;
    }
);
jest.mock(
  "@src/pages/HomePage",
  () =>
    function HomePage() {
      return <div>Mocked HomePage</div>;
    }
);
jest.mock(
  "@src/pages/DetailPage",
  () =>
    function DetailPage() {
      return <div>Mocked DetailPage</div>;
    }
);
jest.mock(
  "@src/pages/ErrorPage",
  () =>
    function ErrorPage() {
      return <div>Mocked ErrorPage</div>;
    }
);

jest.mock("react-router-dom", () => ({
  createBrowserRouter: jest.fn((routes) => ({
    routes: routes,
  })),
}));

describe("router configuration", () => {
  test("should configure routes correctly", () => {
    expect(createBrowserRouter).toHaveBeenCalledTimes(1);

    const routesConfig = createBrowserRouter.mock.calls[0][0];

    expect(routesConfig[0]).toMatchObject({
      path: "/",
      element: expect.any(Object),
    });
    expect(routesConfig[0].element.type.name).toBe("App");

    expect(routesConfig[0].children).toHaveLength(2);
    expect(routesConfig[0].children[0]).toMatchObject({
      path: "/",
      element: expect.any(Object),
    });
    expect(routesConfig[0].children[0].element.type.name).toBe("HomePage");

    expect(routesConfig[0].children[1]).toMatchObject({
      path: "/detail/:locationDate",
      element: expect.any(Object),
    });
    expect(routesConfig[0].children[1].element.type.name).toBe("DetailPage");

    expect(routesConfig[1]).toMatchObject({
      path: "*",
    });
    expect(routesConfig[1].element.type.name).toBe("ErrorPage");
  });
});
