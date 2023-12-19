import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login/Login";
import DashBoard from "./pages/DashBoard/DashBoard";
import NotFound from "./pages/NotFound/NotFound";
import ManageSitePage from "./pages/DashBoard/boss/ManageSitePage";
import SingleSitePage from "./pages/DashBoard/boss/SingleSitePage";
import GoodsStatsPage from "./pages/DashBoard/boss/GoodsStatsPage";
import ManageAccountPage from "./pages/DashBoard/headOfSite/ManageAccountPage";
import GoodsInventoryPage from "./pages/DashBoard/headOfSite/GoodsInventoryPage";
import SingleEmployeePage from "./pages/DashBoard/headOfSite/SingleEmployeePage"
import Home from "./pages/Home/Home";
import Hero from "./components/hero/Hero";
import ForgetPassword from "./pages/forgetPass/ForgetPassword";

import OrderDetailPage from "./components/Staff/OrderDetailPage";
import ManageOrderPage from "./pages/DashBoard/employee/ManageOrderPage";

function App() {
  const ROUTE = [
    {
      path: "/login",
      component: <Login />,
      exact: true,
      isPublic: true,
    },
    {
      path: "/dashboard",
      component: <DashBoard />,
      exact: true,
      isPublic: true,
    },
    {
      path: "/notfound",
      component: <NotFound />,
      exact: true,
      isPublic: true,
    },
  ];

  return (
    <>
      <BrowserRouter>
        <Routes>
          {ROUTE.map((e, i) => (
            <Route key={i} path={e.path} element={e.component} />
          ))}
          {/* <Route path="*" element={<Navigate to="/notfound" />} /> */}
          <Route path="/" element={<Navigate to="/home" />} />

          <Route path="/" element={<DashBoard />}>
            <Route path="boss/manage-sites" element={<ManageSitePage />} />
            <Route path="boss/manage-sites/:id" element={<SingleSitePage />} />
            <Route path="boss/goods-stats" element={<GoodsStatsPage />} />
          </Route>
          <Route path="/" element={<DashBoard />}>
            <Route
              path="head/manage-accounts"
              element={<ManageAccountPage />}
            />
            <Route
              path="head/manage-account/:id"
              element={<SingleEmployeePage />}
            />
            <Route
              path="head/goods-inventory"
              element={<GoodsInventoryPage />}
            />
          </Route>
          <Route path="/" element={<DashBoard />}>
            <Route
              path="employee/manage-orders"
              element={<ManageOrderPage />}
            />
            <Route
              path="employee/order-detail/:id"
              element={<OrderDetailPage />}
            />
          </Route>
          <Route path="/home" element={<Home />}>
            <Route index element={<Hero />} />
            <Route path="/home/login" element={<Login />} />
            <Route path="/home/forget-password" element={<ForgetPassword />} />
          </Route>
          <Route path="/home/tracking/:id" element={<Home />}>
            <Route index element={<Hero />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
