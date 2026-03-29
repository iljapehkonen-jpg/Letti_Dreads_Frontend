import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { Header, Footer } from "./componets";
import { Home, Shop, Instant, Contacts, FAQ, Login, SignUp, Cart, Checkout } from "./pages";
import { fetchCurrentUser } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (user || token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <div className="wrapper">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/instock" element={<Instant />} />
        <Route path="/shop/:id" element={<Shop />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
