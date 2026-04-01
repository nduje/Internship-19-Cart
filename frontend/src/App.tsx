import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";

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
                <Route path="/products/:id" />
                <Route path="/search" />
                <Route
                    path="/login"
                    element={
                        <Layout showHeader={false} showFooter={true}>
                            <Login />
                        </Layout>
                    }
                />
                <Route path="/register" />
            </Route>

            <Route>
                <Route path="/favorites" />
                <Route path="/cart" />
                <Route path="/checkout" />
                <Route
                    path="/profile"
                    element={
                        <Layout showHeader={false} showFooter={true}>
                            <Profile />
                        </Layout>
                    }
                />
                <Route path="/profile/orders" />
                <Route path="/profile/addresses" />
            </Route>

            <Route>
                <Route path="/admin" />
                <Route path="/admin/products" />
                <Route path="/admin/orders" />
                <Route path="/admin/categories" />
            </Route>

            <Route path="*" />
        </Routes>
    );
}

export default App;
