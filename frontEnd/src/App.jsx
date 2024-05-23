import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFormBuy, setShowFormBuy] = useState(null); // Track which product's buy form is showing
  const [showOrders, setShowOrders] = useState(false); // Track if orders are being shown
  const [newPost, setNewPost] = useState({
    img: "",
    name: "",
    content: "",
    price: "",
  });
  const [buyForm, setBuyForm] = useState({
    product_id: "",
    name: "",
    phone: "",
  });
  const [orderMessage, setOrderMessage] = useState("");

  useEffect(() => {
    document.title = "Dobri Project";
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/products")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleBuyInputChange = (e) => {
    const { name, value } = e.target;
    setBuyForm({ ...buyForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8081/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then((newData) => {
        setData([...data, newData]);
        setShowForm(false);
        setNewPost({
          img: "",
          name: "",
          content: "",
          price: "",
        });
      })
      .catch((err) => console.log(err));
  };

  const handleBuy = (e) => {
    e.preventDefault();
    fetch("http://localhost:8081/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buyForm),
    })
      .then((res) => res.text())
      .then((message) => {
        setOrderMessage(message);
        setShowFormBuy(null); // Hide the buy form
        setBuyForm({
          product_id: "",
          name: "",
          phone: "",
        });
      })
      .catch((err) => console.log(err));
  };

  const handleShowOrders = () => {
    if (showOrders) {
      setShowOrders(false);
    } else {
      fetch("http://localhost:8081/show")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setShowOrders(true); // Show the orders table
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDeleteOrder = (orderId) => {
    fetch(`http://localhost:8081/del?id=${orderId}`, {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then((message) => {
        setOrders(orders.filter((order) => order.id !== orderId));
        setOrderMessage(message);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ padding: "50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Form" : "Upload Data"}
        </button>
        <button onClick={handleShowOrders}>
          {showOrders ? "Hide Orders" : "Show Orders"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <div>
            <label>IMG Link:</label>
            <input
              type="text"
              name="img"
              value={newPost.img}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newPost.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              name="content"
              value={newPost.content}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <textarea
              name="price"
              value={newPost.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}

      {showOrders && (
        <table style={{ marginBottom: "20px" }}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.product_id}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>
                  <button onClick={() => handleDeleteOrder(order.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Details</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id}>
              <td>
                <img src={d.img} alt={d.name} />
              </td>
              <td>
                {d.name}
                <br />
                {d.content}
              </td>
              <td>{d.price}</td>
              <td style={{ padding: "20px 20px 20px auto" }}>
                <button
                  onClick={() => {
                    setShowFormBuy(d.id); // Show the buy form for this product
                    setBuyForm({ ...buyForm, product_id: d.id }); // Set the product_id in the buy form
                  }}
                >
                  {showFormBuy === d.id ? "Cancel" : "Buy"}
                </button>
                {showFormBuy === d.id && (
                  <form onSubmit={handleBuy} style={{ marginBottom: "20px" }}>
                    <div>
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={buyForm.name}
                        onChange={handleBuyInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label>Phone:</label>
                      <input
                        type="text"
                        name="phone"
                        value={buyForm.phone}
                        onChange={handleBuyInputChange}
                        required
                      />
                    </div>
                    <button type="submit">Submit</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orderMessage && (
        <div style={{ marginTop: "20px", color: "green" }}>{orderMessage}</div>
      )}
    </div>
  );
}

export default App;
