import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import PropertyList from "./components/home/PropertyList";
import PropertyListing from "./components/propertyListing/PropertyListing";
import Main from "./components/home/Main";
import Accomodation from "./components/accomodation/Accomodation";
import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import Profile from "./components/user/Profile";
import EditProfile from "./components/user/EditProfile";
import MyBookings from "./components/myBookings/MyBookings";
import BookingDetails from "./components/myBookings/BookingDetails";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import AccomodationForm from "./components/accomodation/AccomodationForm";
import ForgetPassword from "./components/user/ForgetPassword";
import ResetPassword from "./components/user/ResetPassword";
import UpdatePassword from "./components/user/UpdatePassword";
import Payment from "./components/payment/Payment";
import NotFound from "./components/NotFound";
import AiTripPlanner from "./components/aiTripPlanner/AiTripPlanner";

import { useDispatch, useSelector } from "react-redux";
import { userActions } from "./store/User/user-slice";
import { currentUser } from "./store/User/user-action";

function SEOHelper() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "HomelyHub — AI-Powered Stay Booking Platform";
    let desc = "Discover and book unique stay accommodations, vacation rentals, apartments, and plan custom trip itineraries with AI.";

    if (path === "/") {
      title = "HomelyHub | Find & Book Unique Vacation Stays & Accommodations";
      desc = "Discover and book unique properties, vacation rentals, apartments, and hotels with HomelyHub.";
    } else if (path.startsWith("/propertylist/")) {
      title = "Property Details | HomelyHub";
      desc = "Explore detailed information, amenities, dates, and images for this accommodation on HomelyHub.";
    } else if (path === "/ai-trip-planner") {
      title = "Trip Genie — AI Travel Itinerary & Stay Planner | HomelyHub";
      desc = "Generate custom day-by-day travel itineraries and find matching accommodations based on your budget.";
    } else if (path === "/accomodation") {
      title = "My Accommodations & Host Listings | HomelyHub";
      desc = "Manage your property listings or list a new stay accommodation on HomelyHub.";
    } else if (path === "/login") {
      title = "Login | HomelyHub";
      desc = "Log in to your HomelyHub account to manage bookings and property listings.";
    } else if (path === "/signup") {
      title = "Sign Up | HomelyHub";
      desc = "Create a new HomelyHub account to start booking stays or listing your properties.";
    } else if (path === "/profile" || path === "/editprofile") {
      title = "My Account Profile | HomelyHub";
      desc = "View and manage your account details on HomelyHub.";
    } else if (path.startsWith("/user/mybookings")) {
      title = "My Bookings | HomelyHub";
      desc = "View your stay reservation history and active bookings on HomelyHub.";
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", `https://homelyhub.vercel.app${path}`);
    }
  }, [location]);

  return null;
}

function App() {
  const dispatch = useDispatch();
  const { errors, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (errors) {
      dispatch(userActions.clearErrors());
    }
  }, [errors, dispatch]);

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  return (
    <div className="App">
      <Toaster position="bottom-center" reverseOrder={false} />
      <Router>
        <SEOHelper />
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<PropertyList />} />
            <Route path="propertylist/:id" element={<PropertyListing />} />

            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="editprofile"
              element={user ? <EditProfile /> : <Navigate to="/login" />}
            />

            <Route path="ai-trip-planner" element={<AiTripPlanner />} />

            <Route path="accomodation" element={<Accomodation />} />
            <Route path="accomodationform" element={<AccomodationForm />} />

            <Route path="user/forgotPassword" element={<ForgetPassword />} />
            <Route
              path="user/resetPassword/:token"
              element={<ResetPassword />}
            />
            <Route
              path="user/updatepassword"
              element={user ? <UpdatePassword /> : <Navigate to="/login" />}
            />

            <Route
              path="user/mybookings"
              element={user ? <MyBookings /> : <Navigate to="/login" />}
            />
            <Route
              path="user/mybookings/:bookingId"
              element={user ? <BookingDetails /> : <Navigate to="/login" />}
            />

            <Route
              path="payment/:propertyId"
              element={user ? <Payment /> : <Navigate to="/login" />}
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
