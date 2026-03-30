import { Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
    return (
        <Routes>
            <Route path="/" />
            <Route path="/products" />
            <Route path="/products/:id" />
            <Route path="/login" />
            <Route path="/register" />

            <Route>
                <Route path="/cart" />
                <Route path="/checkout" />
                <Route path="/profile" />
                <Route path="/profile/orders" />
                <Route path="/profile/addresses" />
            </Route>

            <Route>
                <Route path="/admin" />
                <Route path="/admin/products" />
                <Route path="/admin/orders" />
                <Route path="/admin/categories" />
            </Route>
        </Routes>
    );
}

export default App;
