
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div style={{ padding: "3rem", textAlign: "center" }}>
    <h1>403 - Unauthorized</h1>
    <p>You don’t have permission to view this page.</p>
    <Link to="/login">Go back to login</Link>
  </div>
);

export default Unauthorized;
