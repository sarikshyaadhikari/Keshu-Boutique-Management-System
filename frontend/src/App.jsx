
/*
=========================================================
KESHU BOUTIQUE COLLECTION
Main React Application - App.jsx
=========================================================

Purpose:
This file contains the main frontend functionality of
the Keshu Boutique Management System.

Technologies:
- React.js: Builds the user interface.
- JavaScript: Handles application logic.
- Fetch API: Communicates with the Django backend.
- CSS: Controls the application's appearance.

Main functionality:
1. Dashboard
2. Product Management
3. Add Products
4. Edit Products
5. Delete Products
6. Search Products
7. Display Product Stock Status
=========================================================
*/

// Import React Hooks.
// useState manages changing data in the component.
// useEffect runs code when certain component lifecycle
// conditions occur, such as when the component first loads.
import { useEffect, useState } from "react";

// Import the CSS stylesheet used to design this application.
import "./App.css";


// ========================================================
// API CONFIGURATION
// ========================================================

// This constant stores the URL of the Django product API.
// The React frontend sends requests to this endpoint.
// 127.0.0.1 means the local computer.
// 8000 is the port where the Django backend runs.
// /api/products/ is the product API endpoint.
const API_URL = "http://127.0.0.1:8000/api/products/";


// ========================================================
// INITIAL PRODUCT DATA
// ========================================================

// These are the default values for the product form.
// The form uses these values when adding a new product
// or when the form is reset.
const initialProduct = {
  name: "",                  // Product name.
  description: "",           // Product description.
  category: "Traditional Wear", // Default category.
  price: "",                 // Product price.
  stock_quantity: 0,         // Available stock quantity.
  size: "",                  // Product size.
  colour: "",                // Product colour.
};


// ========================================================
// MAIN REACT COMPONENT
// ========================================================

// App is the main component of the application.
// It contains the dashboard, navigation and product
// management functionality.
function App() {

  // ------------------------------------------------------
  // REACT STATE VARIABLES
  // ------------------------------------------------------

  // Stores the currently selected page.
  // Dashboard is the default page when the app opens.
  const [activePage, setActivePage] = useState("Dashboard");

  // Stores the text entered into the product search field.
  const [search, setSearch] = useState("");

  // Stores the product records retrieved from Django.
  // An empty array means there are initially no products.
  const [products, setProducts] = useState([]);

  // Tracks whether product information is being loaded.
  const [loading, setLoading] = useState(true);

  // Stores error messages from API requests or operations.
  const [error, setError] = useState("");

  // Controls whether the Add/Edit Product form is visible.
  const [showAddForm, setShowAddForm] = useState(false);

  // Tracks whether a product is currently being saved.
  const [saving, setSaving] = useState(false);

  // Stores success messages after completed operations.
  const [success, setSuccess] = useState("");

  // Stores the current values entered in the product form.
  // It starts with the default values from initialProduct.
  const [newProduct, setNewProduct] = useState(initialProduct);

  // Stores the ID of the product currently being edited.
  // null means that no product is currently selected.
  const [editingProduct, setEditingProduct] = useState(null);


  // ------------------------------------------------------
  // SIDEBAR NAVIGATION ITEMS
  // ------------------------------------------------------

  // These names are displayed as navigation options
  // in the application's sidebar.
  const menuItems = [
    "Dashboard",
    "Products",
    "Inventory",
    "Orders",
    "Customers",
    "Suppliers",
    "Reports",
  ];


  // ------------------------------------------------------
  // SAMPLE ORDER DATA
  // ------------------------------------------------------

  // These order records are demonstration data.
  // They are hard-coded in this frontend file.
  // They are not currently retrieved from the Django API.
  const orders = [
    {
      id: "#ORD-001",          // Order reference number.
      customer: "Anita Sharma", // Customer name.
      date: "16 Nov 2026",     // Order date.
      amount: "$150",          // Order amount.
      status: "Confirmed",     // Order status.
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


  // ========================================================
  // FUNCTION 1: FETCH PRODUCTS FROM DJANGO
  // ========================================================

  // This asynchronous function retrieves product records
  // from the Django REST Framework API.
  const fetchProducts = async () => {
    try {

      // Set loading to true while the request is running.
      setLoading(true);

      // Clear any previous error message.
      setError("");

      // Send a GET request to retrieve products from Django.
      // await pauses this function until the request completes.
      const response = await fetch(API_URL);

      // Check whether the HTTP response was successful.
      // If not, throw an error that will be handled by catch.
      if (!response.ok) {
        throw new Error("Unable to retrieve products from Django.");
      }

      // Convert the JSON response into JavaScript data.
      const data = await response.json();

      // Save the retrieved product records in React state.
      // React updates the interface when this state changes.
      setProducts(data);

    } catch (err) {

      // Store the error message if the request fails.
      setError(err.message);

    } finally {

      // Stop the loading state whether the request succeeds
      // or fails.
      setLoading(false);
    }
  };


  // ========================================================
  // FUNCTION 2: LOAD PRODUCTS WHEN THE APP OPENS
  // ========================================================

  // useEffect runs after the component is first displayed.
  // fetchProducts() retrieves the product data from Django.
  // The empty dependency array [] means this effect runs
  // only when the component initially mounts.
  useEffect(() => {
    fetchProducts();
  }, []);


  // ========================================================
  // FUNCTION 3: HANDLE PRODUCT FORM INPUT CHANGES
  // ========================================================

  // This function runs when a user changes a form field.
  const handleInputChange = (e) => {

    // Get the input field's name and current value.
    const { name, value } = e.target;

    // Update the product form state.
    setNewProduct((previous) => ({

      // Preserve all the existing product field values.
      ...previous,

      // Update only the field that the user changed.
      // The field name is used as a dynamic property name.
      [name]: value,
    }));
  };


  // ========================================================
  // FUNCTION 4: ADD A NEW PRODUCT
  // ========================================================

  // This function sends new product information to Django.
  const handleAddProduct = async (e) => {

    // Prevent the browser from refreshing the page
    // when the form is submitted.
    e.preventDefault();

    // Indicate that the save operation is in progress.
    setSaving(true);

    // Clear previous messages.
    setError("");
    setSuccess("");

    try {

      // Send a POST request to the Django product endpoint.
      // POST is used to create a new product record.
      const response = await fetch(API_URL, {
        method: "POST",

        // Tell Django that the request body contains JSON.
        headers: {
          "Content-Type": "application/json",
        },

        // Convert the JavaScript product object into JSON.
        body: JSON.stringify({

          // Include all values currently entered in the form.
          ...newProduct,

          // Convert price from a string into a number.
          price: Number(newProduct.price),

          // Convert stock quantity into a number.
          stock_quantity: Number(newProduct.stock_quantity),
        }),
      });

      // Read the response returned by Django.
      const data = await response.json();

      // Check whether the server successfully created the product.
      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      // Reset the form to its default values.
      setNewProduct(initialProduct);

      // Close the product form after successful creation.
      setShowAddForm(false);

      // Display a success message.
      setSuccess("Product added successfully!");

      // Retrieve the updated product list from Django.
      await fetchProducts();

    } catch (err) {

      // Display an error if the operation fails.
      setError(err.message);

    } finally {

      // Stop the saving indicator.
      setSaving(false);
    }
  };


  // ========================================================
  // FUNCTION 5: OPEN THE EDIT PRODUCT FORM
  // ========================================================

  // This function loads an existing product into the form.
  const handleEditProduct = (product) => {

    // Store the ID of the selected product.
    setEditingProduct(product.id);

    // Fill the form with the selected product's information.
    setNewProduct({
      name: product.name,

      // Use an empty string if the description is missing.
      description: product.description || "",

      category: product.category,
      price: product.price,
      stock_quantity: product.stock_quantity,

      // Use an empty string if size is missing.
      size: product.size || "",

      // Use an empty string if colour is missing.
      colour: product.colour || "",
    });

    // Display the form so the user can edit the product.
    setShowAddForm(true);

    // Clear old messages.
    setError("");
    setSuccess("");
  };


  // ========================================================
  // FUNCTION 6: UPDATE AN EXISTING PRODUCT
  // ========================================================

  // This function sends updated product information to Django.
  const handleUpdateProduct = async (e) => {

    // Prevent the browser from refreshing after submission.
    e.preventDefault();

    // Indicate that an update is in progress.
    setSaving(true);

    // Clear previous messages.
    setError("");
    setSuccess("");

    try {

      // Send a PUT request to the selected product endpoint.
      // The product ID identifies which record to update.
      const response = await fetch(
        `${API_URL}${editingProduct}/`,
        {
          method: "PUT",

          // Tell Django that the request body contains JSON.
          headers: {
            "Content-Type": "application/json",
          },

          // Send the updated product information.
          body: JSON.stringify({

            // Include the current form values.
            ...newProduct,

            // Convert price into a number.
            price: Number(newProduct.price),

            // Convert stock quantity into a number.
            stock_quantity: Number(newProduct.stock_quantity),
          }),
        }
      );

      // Read the server response.
      const data = await response.json();

      // Check whether Django successfully updated the product.
      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      // Display a successful update message.
      setSuccess("Product updated successfully!");

      // Clear the selected product ID.
      setEditingProduct(null);

      // Reset the product form.
      setNewProduct(initialProduct);

      // Close the form.
      setShowAddForm(false);

      // Retrieve the latest product records.
      await fetchProducts();

    } catch (err) {

      // Display an error if the update fails.
      setError(err.message);

    } finally {

      // Stop the saving indicator.
      setSaving(false);
    }
  };


  // ========================================================
  // FUNCTION 7: DELETE A PRODUCT
  // ========================================================

  // This function deletes the selected product through Django.
  const handleDeleteProduct = async (product) => {

    // Ask the user to confirm the deletion.
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    // If the user clicks Cancel, stop the function.
    if (!confirmed) return;

    // Clear previous messages.
    setError("");
    setSuccess("");

    try {

      // Send a DELETE request to the selected product endpoint.
      // The product ID identifies the record to remove.
      const response = await fetch(
        `${API_URL}${product.id}/`,
        {
          method: "DELETE",
        }
      );

      // Check whether Django successfully deleted the product.
      if (!response.ok) {
        throw new Error("Unable to delete this product.");
      }

      // Display a successful deletion message.
      setSuccess("Product deleted successfully!");

      // Refresh the product list after deletion.
      await fetchProducts();

    } catch (err) {

      // Display an error if deletion fails.
      setError(err.message);
    }
  };


  // ========================================================
  // FUNCTION 8: CANCEL THE PRODUCT FORM
  // ========================================================

  // This function closes and resets the Add/Edit form.
  const handleCancelForm = () => {

    // Hide the product form.
    setShowAddForm(false);

    // Clear the selected editing product ID.
    setEditingProduct(null);

    // Reset the form values.
    setNewProduct(initialProduct);

    // Clear the error message.
    setError("");
  };


  // ========================================================
  // FUNCTION 9: FILTER PRODUCTS USING SEARCH
  // ========================================================

  // filter() creates a new array containing only products
  // whose names match the search text.
  //
  // toLowerCase() makes the search case-insensitive.
  // For example, "silk" can match "Silk Saree".
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );


  // ========================================================
  // FUNCTION 10: DETERMINE PRODUCT STOCK STATUS
  // ========================================================

  // If stock quantity is 10 or less, return "Low Stock".
  // Otherwise, return "In Stock".
  //
  // The ? : operator is called a ternary operator.
  const getProductStatus = (stock) =>
    stock <= 10 ? "Low Stock" : "In Stock";


  // ========================================================
  // FUNCTION 11: FORMAT PRODUCT PRICE
  // ========================================================

  // Convert the price to a number and display two decimal places.
  // Example: 150 becomes $150.00.
  const formatPrice = (price) =>
    `$${Number(price).toFixed(2)}`;


  // ========================================================
  // MAIN JSX USER INTERFACE
  // ========================================================

  // return() contains the JSX that React displays in the browser.
  // JSX combines JavaScript expressions and HTML-like elements.
  return (

    // Main container for the entire application.
    <div className="app">

      {/* ===================================================
          SIDEBAR
          Contains branding, navigation and administrator info.
      =================================================== */}

      <aside className="sidebar">

        {/* Boutique logo and branding. */}
        <div className="brand">
          <div className="brand-icon">K</div>
          <div>
            <h2>KESHU</h2>
            <span>BOUTIQUE COLLECTION</span>
          </div>
        </div>

        {/* Sidebar navigation heading. */}
        <p className="menu-label">MAIN MENU</p>

        {/* NAVIGATION MENU */}
        <nav>

          {/* map() creates a button for each menu item. */}
          {menuItems.map((item, index) => (
            <button
              // key helps React identify each item uniquely.
              key={item}

              // Apply the active CSS class to the selected page.
              className={
                activePage === item
                  ? "nav-item active"
                  : "nav-item"
              }

              // Update the active page when a menu item is clicked.
              onClick={() => {
                setActivePage(item);

                // Clear previous messages.
                setSuccess("");
                setError("");

                // Close and reset any open product form.
                handleCancelForm();
              }}
            >
              <span>

                {/* Display an icon based on the menu item's index. */}
                {["⌂", "◇", "▦", "▤", "♙", "♧", "▥"][index]}

              </span>

              {/* Display the navigation item's name. */}
              {item}

            </button>
          ))}

        </nav>

        {/* ADMINISTRATOR PROFILE AT THE BOTTOM OF THE SIDEBAR. */}
        <div className="sidebar-bottom">
          <div className="profile-avatar">SA</div>
          <div>
            <strong>Administrator</strong>
            <span>System Manager</span>
          </div>
        </div>

      </aside>


      {/* ===================================================
          MAIN CONTENT AREA
          Displays the currently selected application page.
      =================================================== */}

      <main className="main-content">

        {/* TOP HEADER */}
        <header className="topbar">

          <div>

            {/* Breadcrumb shows the current page location. */}
            <p className="breadcrumb">
              Keshu Boutique / {activePage}
            </p>

            {/* Page heading changes based on activePage state. */}
            <h1>{activePage}</h1>

          </div>

          {/* Header information on the right side. */}
          <div className="topbar-right">
            <span className="today">16 November 2026</span>
            <div className="notification">♧</div>
            <div className="user-avatar">SA</div>
          </div>

        </header>


        {/* =================================================
            DASHBOARD PAGE
        ================================================= */}

        {/* Only display the dashboard when Dashboard is selected. */}
        {activePage === "Dashboard" && (

          // Fragment groups multiple JSX elements without
          // creating an additional HTML container.
          <>
            {/* WELCOME SECTION */}
            <section className="welcome">
              <div>
                <h2>Welcome back, Administrator!</h2>
                <p>
                  Here's what's happening with your boutique today.
                </p>
              </div>

              <span className="welcome-icon">✦</span>
            </section>


            {/* =================================================
                DASHBOARD STATISTICS
            ================================================= */}

            <section className="stats-grid">

              {/* TOTAL PRODUCTS
                  This value comes from the Django API data
                  stored in the products state. */}
              <div className="stat-card">
                <span className="stat-icon purple">▦</span>
                <p>Total Products</p>
                <h2>{products.length}</h2>
                <small>Products in catalogue</small>
              </div>


              {/* TOTAL ORDERS
                  This is currently a hard-coded demonstration value.
                  It is not retrieved from the backend. */}
              <div className="stat-card">
                <span className="stat-icon green">▤</span>
                <p>Total Orders</p>
                <h2>86</h2>
                <small>Orders recorded</small>
              </div>


              {/* TOTAL CUSTOMERS
                  This is also a hard-coded demonstration value. */}
              <div className="stat-card">
                <span className="stat-icon orange">♙</span>
                <p>Total Customers</p>
                <h2>124</h2>
                <small>Registered customers</small>
              </div>


              {/* LOW STOCK ITEMS
                  filter() checks each product.
                  Products with 10 or fewer items are counted.
                  length returns the number of matching products. */}
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


            {/* =================================================
                DASHBOARD CONTENT
                Displays recent products and recent orders.
            ================================================= */}

            <section className="content-grid">

              {/* RECENT PRODUCTS PANEL */}
              <div className="panel product-panel">

                <div className="panel-heading">
                  <div>
                    <h3>Recent Products</h3>
                    <p>Overview of your boutique inventory</p>
                  </div>

                  {/* Navigate to the Products page when clicked. */}
                  <button
                    className="outline-button"
                    onClick={() => setActivePage("Products")}
                  >
                    View all
                  </button>

                </div>


                {/* PRODUCT SEARCH INPUT */}
                <input
                  className="search-input"
                  placeholder="Search products..."

                  // Display the current search state.
                  value={search}

                  // Update search state when the user types.
                  onChange={(e) => setSearch(e.target.value)}
                />


                {/* Conditional rendering:
                    1. Display loading while products are loading.
                    2. Display an error if a request failed.
                    3. Otherwise, display the product table. */}

                {loading ? (
                  <p>Loading products...</p>

                ) : error ? (
                  <p>{error}</p>

                ) : (

                  <div className="table-wrap">
                    <table>

                      {/* TABLE HEADINGS */}
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Stock</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>


                      {/* TABLE BODY */}
                      <tbody>

                        {/* Display up to four matching products.
                            slice(0, 4) limits the dashboard display.
                            map() creates a table row for each product. */}
                        {filteredProducts.slice(0, 4).map((product) => (

                          // Each product row uses its database ID as key.
                          <tr key={product.id}>

                            <td>
                              <strong>{product.name}</strong>
                            </td>

                            <td>{product.category}</td>

                            <td>{product.stock_quantity}</td>

                            {/* Display the formatted price. */}
                            <td>{formatPrice(product.price)}</td>

                            {/* Display stock status using a CSS class. */}
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


              {/* RECENT ORDERS PANEL */}
              <div className="panel orders-panel">

                <div className="panel-heading">
                  <div>
                    <h3>Recent Orders</h3>
                    <p>Latest customer orders</p>
                  </div>

                  {/* Navigate to the Orders page. */}
                  <button
                    className="outline-button"
                    onClick={() => setActivePage("Orders")}
                  >
                    View all
                  </button>
                </div>


                {/* Display the sample order records.
                    map() creates an order item for each object. */}
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


            {/* DASHBOARD FOOTER */}
            <footer>
              © 2026 Keshu Boutique Collection. All rights reserved.
            </footer>

          </>
        )}


        {/* =================================================
            PRODUCT MANAGEMENT PAGE
        ================================================= */}

        {/* Display this section only when Products is selected. */}
        {activePage === "Products" && (

          <section className="panel product-panel">

            {/* PRODUCT MANAGEMENT HEADER */}
            <div className="panel-heading">

              <div>
                <h3>Product Management</h3>
                <p>Manage your boutique products and stock</p>
              </div>


              {/* ADD PRODUCT BUTTON */}
              <button
                className="outline-button"

                // Toggle the visibility of the product form.
                onClick={() => {

                  // If the form is open, close and reset it.
                  if (showAddForm) {
                    handleCancelForm();

                  } else {

                    // Prepare a new blank product form.
                    setEditingProduct(null);
                    setNewProduct(initialProduct);

                    // Show the form.
                    setShowAddForm(true);

                    // Clear previous messages.
                    setError("");
                    setSuccess("");
                  }
                }}
              >

                {/* Change the button text depending on form visibility. */}
                {showAddForm ? "Cancel" : "+ Add Product"}

              </button>

            </div>


            {/* SUCCESS MESSAGE */}
            {/* && displays the paragraph only when success is not empty. */}
            {success && (
              <p style={{ color: "green", margin: "15px 0" }}>
                {success}
              </p>
            )}


            {/* ERROR MESSAGE */}
            {error && (
              <p style={{ color: "red", margin: "15px 0" }}>
                {error}
              </p>
            )}


            {/* =================================================
                ADD / EDIT PRODUCT FORM
            ================================================= */}

            {/* Display the form only when showAddForm is true. */}
            {showAddForm && (

              <form

                // Decide which function handles submission.
                // If editingProduct has an ID, update the record.
                // Otherwise, create a new product.
                onSubmit={
                  editingProduct
                    ? handleUpdateProduct
                    : handleAddProduct
                }

                // Inline CSS controls the form layout.
                style={{
                  display: "grid",
                  gap: "15px",
                  padding: "20px 0",
                }}
              >

                {/* Form heading changes between Add and Edit. */}
                <h3>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>


                {/* PRODUCT NAME FIELD */}
                <label>
                  Product Name

                  <input
                    className="search-input"
                    name="name"

                    // Connect the input to React state.
                    value={newProduct.name}

                    // Update state when the user types.
                    onChange={handleInputChange}

                    // Browser requires this field to be completed.
                    required
                  />
                </label>


                {/* PRODUCT DESCRIPTION FIELD */}
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


                {/* PRODUCT CATEGORY FIELD */}
                <label>
                  Category

                  <select
                    className="search-input"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                  >
                    {/* Available product categories. */}
                    <option value="Traditional Wear">Traditional Wear</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Festival Wear">Festival Wear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Modern Wear">Modern Wear</option>
                  </select>
                </label>


                {/* PRODUCT PRICE FIELD */}
                <label>
                  Price ($)

                  <input
                    className="search-input"

                    // number input accepts numeric values.
                    type="number"

                    name="price"

                    // Prevent negative price values in the browser.
                    min="0"

                    // Allow prices with two decimal places.
                    step="0.01"

                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </label>


                {/* STOCK QUANTITY FIELD */}
                <label>
                  Stock Quantity

                  <input
                    className="search-input"
                    type="number"
                    name="stock_quantity"

                    // Stock quantity cannot be negative through this input.
                    min="0"

                    value={newProduct.stock_quantity}
                    onChange={handleInputChange}
                    required
                  />
                </label>


                {/* PRODUCT SIZE FIELD */}
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


                {/* PRODUCT COLOUR FIELD */}
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


                {/* FORM ACTION BUTTONS */}
                <div style={{ display: "flex", gap: "10px" }}>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className="outline-button"

                    // Disable the button while saving is in progress.
                    disabled={saving}
                  >

                    {/* Change button text based on saving/editing state. */}
                    {saving
                      ? "Saving..."
                      : editingProduct
                        ? "Save Changes"
                        : "Save Product"}

                  </button>


                  {/* CANCEL BUTTON */}
                  <button
                    type="button"
                    className="outline-button"

                    // Close and reset the form.
                    onClick={handleCancelForm}
                  >
                    Cancel
                  </button>

                </div>

              </form>
            )}


            {/* =================================================
                PRODUCT SEARCH
            ================================================= */}

            {/* Controlled search field for filtering products. */}
            <input
              className="search-input"
              placeholder="Search products..."

              // Display the current search text.
              value={search}

              // Update the search state as the user types.
              onChange={(e) => setSearch(e.target.value)}
            />


            {/* =================================================
                PRODUCT TABLE
            ================================================= */}

            {/* Display loading while the API request is running. */}
            {loading ? (
              <p>Loading products...</p>

            ) : (

              <div className="table-wrap">
                <table>

                  {/* TABLE HEADINGS */}
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>Size</th>
                      <th>Colour</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>


                  {/* TABLE BODY */}
                  <tbody>

                    {/* Loop through every product matching the search. */}
                    {filteredProducts.map((product) => (

                      // Database product ID is used as the unique key.
                      <tr key={product.id}>

                        {/* PRODUCT DETAILS */}
                        <td>
                          <strong>{product.name}</strong>
                        </td>

                        <td>{product.category}</td>

                        <td>{product.stock_quantity}</td>

                        <td>{formatPrice(product.price)}</td>

                        {/* Display a dash if size is empty. */}
                        <td>{product.size || "-"}</td>

                        {/* Display a dash if colour is empty. */}
                        <td>{product.colour || "-"}</td>


                        {/* PRODUCT STOCK STATUS */}
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


                        {/* PRODUCT ACTIONS */}
                        <td>

                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >

                            {/* EDIT PRODUCT BUTTON */}
                            <button
                              type="button"
                              className="outline-button"

                              // Pass the selected product to the edit function.
                              onClick={() => handleEditProduct(product)}

                              style={{
                                padding: "6px 10px",
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>


                            {/* DELETE PRODUCT BUTTON */}
                            <button
                              type="button"

                              // Pass the selected product to the delete function.
                              onClick={() => handleDeleteProduct(product)}

                              style={{
                                padding: "6px 10px",
                                border: "none",
                                borderRadius: "6px",
                                background: "#f8e1e1",
                                color: "#a52a2a",
                                cursor: "pointer",
                              }}
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            )}


            {/* EMPTY SEARCH RESULT MESSAGE */}
            {/* Display this message if loading has finished
                and there are no products matching the search. */}
            {!loading && filteredProducts.length === 0 && (
              <p>No products found.</p>
            )}

          </section>
        )}


        {/* =================================================
            OTHER MODULES / PLACEHOLDER PAGES
        ================================================= */}

        {/* This condition checks whether the active page is
            something other than Dashboard or Products. */}
        {!["Dashboard", "Products"].includes(activePage) && (

          <section className="panel placeholder">

            {/* Display the name of the selected module. */}
            <h2>{activePage}</h2>

            {/* These pages are placeholders in the current version.
                Their full functionality has not been implemented yet. */}
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


// ========================================================
// EXPORT COMPONENT
// ========================================================

// Export App so that main.jsx can import and render it.
// This makes App the main component of the frontend.
export default App;
