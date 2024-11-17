import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reports.css";

const Reports = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/organization/opportunities", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setOpportunities(response.data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        setError("Failed to fetch opportunities.");
      }
    };

    fetchOpportunities();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setSuccess("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedOpportunity) {
      setError("Please select an opportunity.");
      return;
    }
    if (!file) {
      setError("Please choose a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("opportunityId", selectedOpportunity);

    try {
      await axios.post("http://localhost:5000/api/opportunities/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("File uploaded successfully!");
      setFile(null);
      setSelectedOpportunity("");
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file.");
    }
  };

  return (
    <div className="reports-container">
      <h2 className="reports-title">Upload Opportunity Files</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="opportunity" className="form-label">Select Opportunity</label>
          <select
            id="opportunity"
            value={selectedOpportunity}
            onChange={(e) => setSelectedOpportunity(e.target.value)}
            className="form-select"
          >
            <option value="">-- Select an Opportunity --</option>
            {opportunities.map((opp) => (
              <option key={opp._id} value={opp._id}>
                {opp.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="file" className="form-label">Upload File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="form-button">Upload</button>
      </form>
    </div>
  );
};

export default Reports;
