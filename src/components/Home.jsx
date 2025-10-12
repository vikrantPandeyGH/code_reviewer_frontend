import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const Home = () => {
  const [allprojects,setallprojects] = useState([])
  const navigate = useNavigate()
  useEffect(function(){
    axios.get('https://code-reviewer-backend-flax.vercel.app/projects/get-all').then(function(res){
         setallprojects(res.data.data)
    })
  },[])

  function projecthandler(proj_id){
      navigate('/project/'+proj_id)
  }

  return (
    <div id="home">
      <Link to="/create-project">
        <button id="new-proj">New project</button>
      </Link>

      <div id="project-list">
        <ul>
          {
           allprojects.map(function(project){
            return  <li className="projects" onClick={function(){
              projecthandler(project._id)
            }}>{project.name}</li>
          })
          }
        </ul>
      </div>
    </div>
  );
};

export default Home;