import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import Layout from "./components/Layout/Layout";
import AddProduct from "./pages/AddProduct/AddProduct";
import Admin from "./pages/Admin/Admin";
import EditProduct from "./pages/EditProduct/EditProduct";
import EditProfile from "./pages/EditProfile/EditProfile";
import Favorites from "./pages/Favorites/Favorites";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ManageCategories from "./pages/ManageCategories/ManageCategories";
import ManageOrders from "./pages/ManageOrders/ManageOrders";
import ManageProducts from "./pages/ManageProducts/ManageProducts";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import Search from "./pages/Search/Search";

function App() {
    return (
        <Routes>
            <Route>
                <Route
                    path="/"
                    element={
                        <Layout showHeader={true} showFooter={true}>
                            <Home />
                        </Layout>
                    }
                />
                <Route path="/products" />
                <Route
                    path="/products/:id"
                    element={
                        <Layout showHeader={true} showFooter={true}>
                            <ProductDetail />
                        </Layout>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <Layout showHeader={true} showFooter={true}>
                            <Search />
                        </Layout>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <Layout showHeader={false} showFooter={true}>
                            <Login />
                        </Layout>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <Layout showHeader={false} showFooter={true}>
                            <Register />
                        </Layout>
                    }
                />
            </Route>

            <Route>
                <Route
                    path="/favorites"
                    element={
                        <Layout showHeader={true} showFooter={true}>
                            <Favorites />
                        </Layout>
                    }
                />
                <Route path="/cart" />
                <Route path="/checkout" />
                <Route
                    path="/profile"
                    element={
                        <Layout showHeader={true} showFooter={true}>
                            <Profile />
                        </Layout>
                    }
                />
                <Route
                    path="/profile/edit"
                    element={
                        <Layout showHeader={false} showFooter={true}>
                            <EditProfile />
                        </Layout>
                    }
                />
            </Route>

            <Route>
                <Route
                    path="/admin"
                    element={
                        <AdminLayout>
                            <Admin />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/products"
                    element={
                        <AdminLayout>
                            <ManageProducts />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/products/add"
                    element={
                        <AdminLayout>
                            <AddProduct />
                        </AdminLayout>
                    }
                ></Route>
                <Route
                    path="/admin/products/edit/:id"
                    element={
                        <AdminLayout>
                            <EditProduct />
                        </AdminLayout>
                    }
                ></Route>
                <Route
                    path="/admin/orders"
                    element={
                        <AdminLayout>
                            <ManageOrders />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/categories"
                    element={
                        <AdminLayout>
                            <ManageCategories />
                        </AdminLayout>
                    }
                />
            </Route>

            <Route path="*" />
        </Routes>
    );
}

export default App;
