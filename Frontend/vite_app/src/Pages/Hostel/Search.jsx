

// import React, { useState, useEffect } from "react";
// import "./searchbar.css";

// const HostelList = () => {
//   const [hostels, setHostels] = useState([]);

//   useEffect(() => {
//     fetchHostels(); // Fetch all hostels when the page loads
//   }, []);

//   const fetchHostels = async () => {
//     try {
//       const response = await fetch("http://localhost:3000/hostels"); // Ensure this fetches the schema data
//       const data = await response.json();

//       // Flatten the hostels array from different areas
//       const allHostels = data.reduce((acc, area) => {
//         return [...acc, ...area.hostels]; // Flatten the hostels from all areas
//       }, []);

//       setHostels(allHostels); // Set the flattened list of hostels
//     } catch (error) {
//       console.error("Error fetching hostels:", error);
//     }
//   };

//   return (
//     <div className="container">
//       <h2 className="title">Best Hostels</h2>
//       <div className="hostel-grid">
//         {hostels.length > 0 ? (
//           hostels.map((hostel, index) => (
//             <div key={index} className="hostel-card">
//               <div>
//               <img
//                 src={hostel.image}
//                 alt={hostel.name}
//                 className="hostel-image"
//               />
//               </div>
// <div>
// <h3>{hostel.name}</h3>
//               <p>
//                 <strong>Location:</strong> {hostel.area || "Unknown Area"}
//               </p>
//               <p>
//                 <strong>Price:</strong> ₹{hostel.price} per month
//               </p>
//               <p>
//                 <strong>Ratings:</strong> ⭐ {hostel.rating}
//               </p>
//               <p>
//                 <strong>Occupancy:</strong> {hostel.occupancy} people
//               </p>
//               <div className="buttons">
//                 <a href={hostel.visitUrl} className="visit-btn">
//                   Visit
//                 </a>
//                 <a href={hostel.viewMoreUrl} className="view-more-btn">
//                   View More
//                 </a>
//               </div>
// </div>

//             </div>
//           ))
//         ) : (
//           <p className="no-results">No hostels available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HostelList;



// import React, { useState, useEffect } from "react";
// import "./searchbar.css";

// const HostelList = () => {
//   const [hostels, setHostels] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     fetchHostels();
//   }, []);

//   const fetchHostels = async () => {
//     try {
//       const response = await fetch("http://localhost:3000/hostels");
//       const data = await response.json();

//       const allHostels = data.reduce((acc, area) => {
//         return [...acc, ...area.hostels];
//       }, []);

//       setHostels(allHostels);
//     } catch (error) {
//       console.error("Error fetching hostels:", error);
//     }
//   };

//   // Filter hostels based on search query (by name or area)
//   const filteredHostels = hostels.filter(
//     (hostel) =>
//       hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (hostel.area && hostel.area.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   return (
//     <div className="container">
//       <h2 className="title">Best Hostels</h2>

//       {/* Search Bar */}
//       <input
//         type="text"
//         placeholder="Search by hostel name or area..."
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         className="search-bar"
//       />

//       <div className="hostel-grid">
//         {filteredHostels.length > 0 ? (
//           filteredHostels.map((hostel, index) => (
//             <div key={index} className="hostel-card">
//               <div>
//                 <img src={hostel.image} alt={hostel.name} className="hostel-image" />
//               </div>
//               <div>
//                 <h3>{hostel.name}</h3>
//                 <p>
//                   <strong>Location:</strong> {hostel.area || "Unknown Area"}{console.log(hostel.area)}
//                 </p>
//                 <p>
//                   <strong>Price:</strong> ₹{hostel.price} per month
//                 </p>
//                 <p>
//                   <strong>Ratings:</strong> ⭐ {hostel.rating}
//                 </p>
//                 <p>
//                   <strong>Occupancy:</strong> {hostel.occupancy} people
//                 </p>
//                 <div className="buttons">
//                   <a href={hostel.visitUrl} className="visit-btn">
//                     Visit
//                   </a>
//                   <a href={hostel.viewMoreUrl} className="view-more-btn">
//                     View More
//                   </a>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="no-results">No hostels found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HostelList;


import React, { useState, useEffect } from "react";
import "./searchbar.css";

const HostelList = () => {
  const [allHostels, setAllHostels] = useState([]);
  const [displayedHostels, setDisplayedHostels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [selectedLocality, setSelectedLocality] = useState("");
  const [selectedRent, setSelectedRent] = useState("");
  const [selectedOccupancy, setSelectedOccupancy] = useState("");

  // Flag to track when search is triggered
  const [searchTriggered, setSearchTriggered] = useState(false);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await fetch("https://homy-cnqt.onrender.com/api/hostel");
      const data = await response.json();

      const hostels = data.reduce((acc, area) => {
        return [...acc, ...area.hostels.map(hostel => ({ ...hostel, area: area.area }))];
      }, []);

      setAllHostels(hostels);
      setDisplayedHostels(hostels.slice(-8).reverse());
    } catch (error) {
      console.error("Error fetching hostels:", error);
    }
  };

  // Function to filter hostels when search is triggered
  const handleSearch = () => {
    let filteredHostels = allHostels;

    if (searchQuery.trim()) {
      filteredHostels = filteredHostels.filter(
        (hostel) =>
          hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hostel.area.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLocality) {
      filteredHostels = filteredHostels.filter((hostel) => hostel.area === selectedLocality);
    }

    if (selectedRent) {
      const [min, max] = selectedRent.split("-").map(Number);
      filteredHostels = filteredHostels.filter((hostel) => hostel.price >= min && hostel.price <= max);
    }

    if (selectedOccupancy) {
      filteredHostels = filteredHostels.filter((hostel) => hostel.occupancy === Number(selectedOccupancy));
    }

    setDisplayedHostels(filteredHostels);
    setSearchTriggered(true);
  };

  return (
    <div className="container">
      <h2 className="title">Find The Best Hostels and PG's in Your Area.</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by hostel name or area..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Filters Section */}
      <div className="filters">
        {/* Locality Filter */}
        <select value={selectedLocality} onChange={(e) => setSelectedLocality(e.target.value)} className="filter-select">
          <option value="">Select Locality</option>
          {[...new Set(allHostels.map((hostel) => hostel.area))].map((area, index) => (
            <option key={index} value={area}>
              {area}
            </option>
          ))}
        </select>

        {/* Rent Filter */}
        <select value={selectedRent} onChange={(e) => setSelectedRent(e.target.value)} className="filter-select">
          <option value="">Select Rent</option>
          <option value="3000-5000">₹4000 - ₹5000</option>
          <option value="5000-7000">₹5000 - ₹7000</option>
          <option value="7000-10000">₹7000 - ₹10000</option>
          <option value="10000-12000">₹10000 - ₹12000</option>
          <option value="12000-15000">₹12000 - ₹15000</option>
        </select>

        {/* Occupancy Filter (1 to 10) */}
        <select value={selectedOccupancy} onChange={(e) => setSelectedOccupancy(e.target.value)} className="filter-select">
          <option value="">Select Occupancy</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} People
            </option>
          ))}
        </select>

        {/* Search Button */}
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>

        {/* Reset Filters Button */}
        <button onClick={() => {
          setSelectedLocality("");
          setSelectedRent("");
          setSelectedOccupancy("");
          setSearchQuery("");
          setDisplayedHostels(allHostels.slice(-8).reverse());
          setSearchTriggered(false);
        }} className="reset-btn">
          Reset Filters
        </button>
      </div>

      {/* Hostels Grid */}
      <div className="hostel-grid">
        {searchTriggered && displayedHostels.length === 0 ? (
          <p className="no-results">No hostels found.</p>
        ) : (
          displayedHostels.map((hostel, index) => (
            <div key={index} className="hostel-card">
              <div>
                <img src={hostel.image} alt={hostel.name} className="hostel-image" />
              </div>
              <div>
                <h3>{hostel.name}</h3>
                <p><strong>Location:</strong> {hostel.area}</p>
                <p><strong>Price:</strong> ₹{hostel.price} per month</p>
                <p><strong>Ratings:</strong> ⭐ {hostel.rating}</p>
                <p><strong>Occupancy:</strong> {hostel.occupancy} people</p>
                <div className="buttons">
                  <button className="details-btn" onClick={() => alert(`Details for ${hostel.name}`)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HostelList;

