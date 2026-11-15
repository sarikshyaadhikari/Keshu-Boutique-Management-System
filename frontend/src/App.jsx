
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api/products/";

const initialProduct = {
  name: "",
  description: "",
  category: "Traditional Wear",
  price: "",
  stock_quantity: 0,
  size: "",
  colour: "",
};

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [newProduct, setNewProduct] = useState(initialProduct);

  const menuItems = [
    "Dashboard",
    "Products",
    "Inventory",
    "Orders",
    "Customers",
    "Suppliers",
    "Reports",
  ];

  const orders = [
    {
      id: "#ORD-001",
      customer: "Anita Sharma",
      date: "16 Nov 2026",
      amount: "$150",
      status: "Confirmed",
    },
    {
      id: "#ORD-002",
      customer: "Priya Karki",
      date: "15 Nov 2026",
      amount: "$220",
      status: "Processing",
    },
    {
      id: "#ORD-003",
      customer: "Maya Gurung",
      date: "15 Nov 2026",
      amount: "$85",
      status: "Pending",
    },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to retrieve products from Django.");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewProduct((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock_quantity: Number(newProduct.stock_quantity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          JSON.stringify(data)
        );
      }

      setNewProduct(initialProduct);
      setShowAddForm(false);
      setSuccess("Product added successfully!");

      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const getProductStatus = (stock) =>
    stock <= 10 ? "Low Stock" : "In Stock";

  const formatPrice = (price) =>
    `$${Number(price).toFixed(2)}`;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">K</div>
          <div>
            <h2>KESHU</h2>
            <span>BOUTIQUE COLLECTION</span>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav>
          {menuItems.map((item, index) => (
            <button
              key={item}
              className={
                activePage === item
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => {
                setActivePage(item);
                setSuccess("");
                setError("");
                setShowAddForm(false);
              }}
            >
              <span>
                {["⌂", "◇", "▦", "▤", "♙", "♧", "▥"][index]}
              </span>
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-avatar">SA</div>
          <div>
            <strong>Administrator</strong>
            <span>System Manager</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">
              Keshu Boutique / {activePage}
            </p>
            <h1>{activePage}</h1>
          </div>

          <div className="topbar-right">
            <span className="today">16 November 2026</span>
            <div className="notification">♧</div>
            <div className="user-avatar">SA</div>
          </div>
        </header>

        {activePage === "Dashboard" && (
          <>
            <section className="welcome">
              <div>
                <h2>Welcome back, Administrator!</h2>
                <p>
                  Here's what's happening with your boutique today.
                </p>
              </div>
              <span className="welcome-icon">✦</span>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon purple">▦</span>
                <p>Total Products</p>
                <h2>{products.length}</h2>
                <small>Products in catalogue</small>
              </div>

              <div className="stat-card">
                <span className="stat-icon green">▤</span>
                <p>Total Orders</p>
                <h2>86</h2>
                <small>Orders recorded</small>
              </div>

              <div className="stat-card">
                <span className="stat-icon orange">♙</span>
                <p>Total Customers</p>
                <h2>124</h2>
                <small>Registered customers</small>
              </div>

              <div className="stat-card">
                <span className="stat-icon pink">!</span>
                <p>Low Stock Items</p>
                <h2>
                  {
                    products.filter(
                      (product) => product.stock_quantity <= 10
                    ).length
                  }
                </h2>
                <small>Require attention</small>
              </div>
            </section>

            <section className="content-grid">
              <div className="panel product-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent Products</h3>
                    <p>Overview of your boutique inventory</p>
                  </div>

                  <button
                    className="outline-button"
                    onClick={() => setActivePage("Products")}
                  >
                    View all
                  </button>
                </div>

                <input
                  className="search-input"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {loading ? (
                  <p>Loading products...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Stock</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredProducts.slice(0, 4).map((product) => (
                          <tr key={product.id}>
                            <td><strong>{product.name}</strong></td>
                            <td>{product.category}</td>
                            <td>{product.stock_quantity}</td>
                            <td>{formatPrice(product.price)}</td>
                            <td>
                              <span
                                className={
                                  product.stock_quantity <= 10
                                    ? "status low"
                                    : "status good"
                                }
                              >
                                {getProductStatus(product.stock_quantity)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="panel orders-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent Orders</h3>
                    <p>Latest customer orders</p>
                  </div>

                  <button
                    className="outline-button"
                    onClick={() => setActivePage("Orders")}
                  >
                    View all
                  </button>
                </div>

                {orders.map((order) => (
                  <div className="order-item" key={order.id}>
                    <div>
                      <strong>{order.customer}</strong>
                      <span>
                        {order.id} · {order.date}
                      </span>
                    </div>

                    <div className="order-right">
                      <strong>{order.amount}</strong>
                      <span className="order-status">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <footer>
              © 2026 Keshu Boutique Collection. All rights reserved.
            </footer>
          </>
        )}

        {activePage === "Products" && (
          <section className="panel product-panel">
            <div className="panel-heading">
              <div>
                <h3>Product Management</h3>
                <p>Manage your boutique products and stock</p>
              </div>

              <button
                className="outline-button"
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setError("");
                  setSuccess("");
                }}
              >
                {showAddForm ? "Cancel" : "+ Add Product"}
              </button>
            </div>

            {success && (
              <p style={{ color: "green", margin: "15px 0" }}>
                {success}
              </p>
            )}

            {error && (
              <p style={{ color: "red", margin: "15px 0" }}>
                {error}
              </p>
            )}

            {showAddForm && (
              <form
                onSubmit={handleAddProduct}
                style={{
                  display: "grid",
                  gap: "15px",
                  padding: "20px 0",
                }}
              >
                <h3>Add New Product</h3>

                <label>
                  Product Name
                  <input
                    className="search-input"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Description
                  <textarea
                    className="search-input"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </label>

                <label>
                  Category
                  <select
                    className="search-input"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Traditional Wear">Traditional Wear</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Festival Wear">Festival Wear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Modern Wear">Modern Wear</option>
                  </select>
                </label>

                <label>
                  Price ($)
                  <input
                    className="search-input"
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Stock Quantity
                  <input
                    className="search-input"
                    type="number"
                    name="stock_quantity"
                    min="0"
                    value={newProduct.stock_quantity}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Size
                  <input
                    className="search-input"
                    name="size"
                    placeholder="e.g. S, M, L, XL"
                    value={newProduct.size}
                    onChange={handleInputChange}
                  />
                </label>

                <label>
                  Colour
                  <input
                    className="search-input"
                    name="colour"
                    placeholder="e.g. Maroon"
                    value={newProduct.colour}
                    onChange={handleInputChange}
                  />
                </label>

                <button
                  type="submit"
                  className="outline-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </form>
            )}

            <input
              className="search-input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {loading ? (
              <p>Loading products...</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>Size</th>
                      <th>Colour</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td><strong>{product.name}</strong></td>
                        <td>{product.category}</td>
                        <td>{product.stock_quantity}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>{product.size || "-"}</td>
                        <td>{product.colour || "-"}</td>
                        <td>
                          <span
                            className={
                              product.stock_quantity <= 10
                                ? "status low"
                                : "status good"
                            }
                          >
                            {getProductStatus(product.stock_quantity)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <p>No products found.</p>
            )}
          </section>
        )}

        {!["Dashboard", "Products"].includes(activePage) && (
          <section className="panel placeholder">
            <h2>{activePage}</h2>
            <p>
              This section is ready for the next development stage.
            </p>
            <p>
              We'll implement its functionality step by step.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
