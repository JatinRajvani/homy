
import React, { useEffect, useState } from "react";
import "./snacks.css";
import { useNavigate } from "react-router-dom";
import SearchBar from '../../Components/Search'
const MealCard = ({ meal }) => {
    const navigate = useNavigate();
    const [count,setCount]=useState(1);
  


    const increaseCount = () => setCount(count + 1);
    const decreaseCount = () => setCount(count > 1 ? count - 1 : 1);
  
    return (
      <div className="mealcard">
        <img
          src={meal.image || "https://res.cloudinary.com/doqzxuxb1/image/upload/v1740137496/Thepla-231x300_edl9q5.png"} 
          alt={meal.name}
          className="snackimg"
        />
        <div className="maindesc">
          <h1>{meal.name}</h1>
          <div className="Pricing">
            <span>₹{meal.price}</span>
            <div className="Quantity">
      <button  onClick={decreaseCount} className="sub" >−</button>

        <span >{count}</span>
        <button  onClick={increaseCount} className="add" >+</button>
            </div>
          </div>
          <div className="buy">
            <button onClick={() => navigate("/")}>Buy Now</button>
            <button onClick={() => navigate("/")}>Add To Cart</button>
          </div>
        </div>
      </div>
    );
  };


const Snacks = () => {
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await fetch("https://homy-cnqt.onrender.com/api/meals");
      const data = await response.json();
      setMeals(data); // Updating the meals state
    } catch (error) {
      console.error("Error fetching the data:", error);
    }
  };

 // Adding A option for finding the sancks by its name
 const FilteredHostels=meals.filter(
  (meal)=>meal.name.toLowerCase().includes(searchQuery.toLowerCase())
 );




  return (
    <main className="mainsnacks">

     <div className="Firstpart">
        <section className="title"> 
        <h1>Discover Delicious Homemade Food Near You</h1>
        <p>Authentic home-cooked meals delivered to your doorstep.</p>
        </section>
        {/* <h1>Find The Best Snacks and Food in Your Area</h1> */}
        {/* <div className="search-bar">
          <input type="text" placeholder="Search for homemade food..."  onChange={(e) => setSearchQuery(e.target.value)}  />
          <button>Search</button>
      </div> */}


     </div>
     
    

    {/*Searchbar*/}
      <div className="snacks-container">
        {FilteredHostels.length > 0 ? (
          FilteredHostels.map((meal) => <MealCard key={meal.id} meal={meal} />)
        ) : (
          <p>Loading snacks...</p>
        )}
      </div>
    </main>
  );
};



export default Snacks;
