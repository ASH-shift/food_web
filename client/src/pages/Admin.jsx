import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const Admin = () => {
  const [food, setFood] = useState({
    name: "",
    desc: "",
    img: "",
    price: "",
    category: "",
  });

  const handleSubmit = async () => {
    const token = localStorage.getItem("krist-app-token");

    await axios.post(
      "http://localhost:8080/api/food/add",
      [
        {
          name: food.name,
          desc: food.desc,
          img: food.img,
          price: { org: Number(food.price) },
          category: [food.category],
          ingredients: [],
        },
      ],
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Food Added Successfully");
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <input
        placeholder="Food Name"
        onChange={(e) => setFood({ ...food, name: e.target.value })}
      />

      <input
        placeholder="Description"
        onChange={(e) => setFood({ ...food, desc: e.target.value })}
      />

      <input
        placeholder="Image URL"
        onChange={(e) => setFood({ ...food, img: e.target.value })}
      />

      <input
        placeholder="Price"
        onChange={(e) => setFood({ ...food, price: e.target.value })}
      />

      <input
        placeholder="Category"
        onChange={(e) => setFood({ ...food, category: e.target.value })}
      />

      <button onClick={handleSubmit}>Add Food</button>
    </div>
  );
};

export default Admin;
