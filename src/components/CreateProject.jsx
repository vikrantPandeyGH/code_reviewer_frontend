import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CreateProject = () => {
  const navigate = useNavigate();
  const [projectname, setprojectname] = useState("");

  function handlesubmit(event) {
    event.preventDefault();
    axios
      .post("http://localhost:3000/projects/create", {
        projectname,
      })
      .then(function () {
        navigate("/");
      });
  }
  return (
    <div id="project">
      <form onSubmit={handlesubmit}>
        <input
          type="text"
          placeholder="project name"
          value={projectname}
          onChange={function (event) {
            setprojectname(event.target.value);
          }}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default CreateProject;