import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useEffect, lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";

import Main from "./components/home/Main";
import Skeleton from "./components/ui/Skeleton";

import { useDispatch, useSelector } from "react-redux";
import { userActions } from "./store/User/user-slice";
import { currentUser } from "./store/User/user-action";

// Lazy-loaded route components
const PropertyList = lazy(() => import("./components/home/PropertyList"));
const PropertyListing = lazy(() => import("./components/propertyListing/PropertyListing"));
const Accomodation = lazy(() => import("./components/accomodation/Accomodation"));
const AccomodationForm = lazy(() => import("./components/accomodation/AccomodationForm"));
const Login = lazy(() => import("./components/user/Login"));
const Signup = lazy(() => import("./components/user/Signup"));
const Profile = lazy(() => import("./components/user/Profile"));
const EditProfile = lazy(() => import("./components/user/EditProfile"));
const MyBookings = lazy(() => import("./components/myBookings/MyBookings"));
const BookingDetails = lazy(() => import("./components/myBookings/BookingDetails"));
const ForgetPassword = lazy(() => import("./components/user/ForgetPassword"));
const ResetPassword = lazy(() => import("./components/user/ResetPassword"));
const UpdatePassword = lazy(() => import("./components/user/UpdatePassword"));
const Payment = lazy(() => import("./components/payment/Payment"));
const AiTripPlanner = lazy(() => import("./components/aiTripPlanner/AiTripPlanner"));
const NotFound = lazy(() => import("./components/NotFound"));

const PageSkeleton = () => (
  <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
    <Skeleton variant="heading" width="40%" height="2.5rem" style={{ marginBottom: "1rem" }} />
    <Skeleton variant="text" width="60%" height="1.2rem" style={{ marginBottom: "2rem" }} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
      <Skeleton variant="image" height="220px" />
      <Skeleton variant="image" height="220px" />
      <Skeleton variant="image" height="220px" />
    </div>
  </div>
);

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
      canonical.setAttribute("href", `https://homely-hubx.vercel.app${path}`);
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
        <Suspense fallback={<PageSkeleton />}>
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
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
