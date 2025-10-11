import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import CreateProject from "./CreateProject";
import Projectpage from "./Projectpage";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/project/:id" element={<Projectpage/>}></Route>
      <Route path="/create-project" element={<CreateProject />}></Route>
    </Routes>
  );
};

export default Routers;