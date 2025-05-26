import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Contact from "../pages/Contact";
import Create from "../pages/Create";
import Private from "../pages/Private";
import Public from "../pages/Public";
import Nopage from "../pages/Nopage";

const Allroutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signin"
          element={
            <Public>
              <Signin />
            </Public>
          }
        />
        <Route
          path="/signup"
          element={
            <Public>
              <Signup />
            </Public>
          }
        />
        <Route
          path="/contact"
          element={
            <Private>
              <Contact />
            </Private>
          }
        />
        <Route path="/create" element={<Create />} />
        {/* <Route path='/update/:id' element={<Update />} /> */}
        <Route path="*" element={<Nopage />} />
      </Routes>
    </div>
  );
};

export default Allroutes;
