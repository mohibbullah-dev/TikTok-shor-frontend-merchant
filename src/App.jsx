import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth pages
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// // Main pages

import Home from "./pages/home/Home";
import Orders from "./pages/orders/Orders";
import OrderDetail from "./pages/orders/OrderDetail";
import Products from "./pages/products/Products";
import ProductDetail from "./pages/products/ProductDetail";
import Distribution from "./pages/products/Distribution";
import Profile from "./pages/profile/Profile";
import PersonalInfo from "./pages/profile/PersonalInfo";
import Settings from "./pages/profile/Settings";
import BaseInfo from "./pages/profile/BaseInfo";
import BannerUpload from "./pages/profile/BannerUpload";
import Language from "./pages/profile/Language";
import Recharge from "./pages/wallet/Recharge";
import WalletRecharge from "./pages/wallet/WalletRecharge";
import Withdraw from "./pages/wallet/Withdraw";
import FundsRecords from "./pages/wallet/FundsRecords";
import Finance from "./pages/wallet/Finance";
import VipUpgrade from "./pages/vip/VipUpgrade";
import Calendar from "./pages/attendance/Calendar";
import ChatWidget from "./pages/chat/ChatWidget";
import Messages from "./pages/notices/Messages";
import Complaint from "./pages/complaints/Complaint";
import Questions from "./pages/faq/Questions";
// import Home from "./pages/home/Home";
// import Orders from "./pages/orders/Orders";
// import OrderDetail from "./pages/orders/OrderDetail";
// import Products from "./pages/products/Products";
// import ProductDetail from "./pages/products/ProductDetail";
// import Distribution from "./pages/products/Distribution";
// import Profile from "./pages/profile/Profile";
// import PersonalInfo from "./pages/profile/PersonalInfo";
// import Settings from "./pages/profile/Settings";
// import BaseInfo from "./pages/profile/BaseInfo";
// import BannerUpload from "./pages/profile/BannerUpload";
// import Language from "./pages/profile/Language";

// // Wallet pages
// import Recharge from "./pages/wallet/Recharge";
// import WalletRecharge from "./pages/wallet/WalletRecharge";
// import Withdraw from "./pages/wallet/Withdraw";
// import FundsRecords from "./pages/wallet/FundsRecords";
// import Finance from "./pages/wallet/Finance";

// // Other pages
// import VipUpgrade from "./pages/vip/VipUpgrade";
// import Calendar from "./pages/attendance/Calendar";
// import ChatWidget from "./pages/chat/ChatWidget";
// import Messages from "./pages/notices/Messages";
// import Complaint from "./pages/complaints/Complaint";
// import Questions from "./pages/faq/Questions";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  console.log("const { token} : ", token);
  console.log("const { user } : ", user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "merchant") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected merchant routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/:id"
        element={
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/distribution"
        element={
          <ProtectedRoute>
            <Distribution />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/personal"
        element={
          <ProtectedRoute>
            <PersonalInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/baseinfo"
        element={
          <ProtectedRoute>
            <BaseInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/banners"
        element={
          <ProtectedRoute>
            <BannerUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/language"
        element={
          <ProtectedRoute>
            <Language />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recharge"
        element={
          <ProtectedRoute>
            <Recharge />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recharge/wallet"
        element={
          <ProtectedRoute>
            <WalletRecharge />
          </ProtectedRoute>
        }
      />
      <Route
        path="/withdraw"
        element={
          <ProtectedRoute>
            <Withdraw />
          </ProtectedRoute>
        }
      />
      <Route
        path="/funds"
        element={
          <ProtectedRoute>
            <FundsRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <Finance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vip"
        element={
          <ProtectedRoute>
            <VipUpgrade />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatWidget />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaint"
        element={
          <ProtectedRoute>
            <Complaint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faq"
        element={
          <ProtectedRoute>
            <Questions />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
