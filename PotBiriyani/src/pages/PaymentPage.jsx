import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import "./PaymentPage.css";

// Invoice Document Component
const InvoiceDocument = ({
  items,
  amount,
  address,
  city,
  state,
  postalCode,
  country,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.restaurantName}>Pot Biriyani</Text>
        <Text style={styles.invoiceTitle}>Invoice</Text>
        <Text style={styles.thankYouNote}>Thank you for dining with us!</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <Text style={styles.addressDetails}>
          Date: {new Date().toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items:</Text>
        {items.map((item) => (
          <Text key={item._id} style={styles.item}>
            {item.name} - LKR {item.price} x {item.quantity || 1} = LKR{" "}
            {(item.price * (item.quantity || 1)).toFixed(2)}
          </Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.totalAmount}>Total Amount: LKR {amount}</Text>
      </View>
      <View>
        <Text style={styles.shippingAddress}>Shipping Address:</Text>
        <Text style={styles.addressDetails}>
          {address}, {city}, {state}, {postalCode}, {country}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text>Please keep this receipt for your records.</Text>
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d9534f",
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  thankYouNote: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5a5a5a",
    borderBottom: "1px solid #d9534f",
    paddingBottom: 5,
  },
  item: {
    fontSize: 12,
    marginVertical: 2,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d9534f",
  },
  shippingAddress: {
    fontSize: 14,
    fontWeight: "bold",
  },
  addressDetails: {
    fontSize: 12,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
  },
});

const PaymentPage = () => {
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState("shipping");
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const storedItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    setItems(storedItems);

    const totalAmount = storedItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0,
    );
    setAmount(totalAmount.toFixed(2));
  }, [navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (
      !amount ||
      !cardNumber ||
      !expiryDate ||
      !cvv ||
      !address ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    const orderData = {
      items: items.map((item) => ({
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      totalPrice: parseFloat(amount),
      shippingDetails: {
        address,
        city,
        state,
        postalCode,
        country,
      },
      paymentDetails: {
        amount: parseFloat(amount),
        cardNumber,
        expiryDate,
        cvv,
      },
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(result.message);
        sessionStorage.removeItem("cartItems");
        setPdfGenerated(true);
      } else {
        setError(
          result.message || "An error occurred while processing your payment.",
        );
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError(
        "Failed to process payment. Please check the console for details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page-container">
      <div className="payment-content">
        <div className="payment-summary">
          <h2 className="payment-section-title">Items</h2>
          <ul className="payment-item-list list-group">
            {items.length === 0 ? (
              <li className="list-group-item">No items available</li>
            ) : (
              items.map((item) => (
                <li key={item._id} className="payment-item list-group-item">
                  {item.name} - LKR {item.price} x {item.quantity || 1}
                </li>
              ))
            )}
          </ul>
          <h4 className="payment-total-amount mt-3">
            Total Amount: LKR {amount}
          </h4>
        </div>
        <div className="payment-forms">
          {currentSection === "shipping" && (
            <>
              <h2 className="payment-section-title">Shipping Details</h2>
              <form>
                <div className="form-group payment-form-group">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="form-control payment-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group payment-form-group">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="form-control payment-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group payment-form-group">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    className="form-control payment-input"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group payment-form-group">
                  <label htmlFor="postalCode" className="form-label">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    className="form-control payment-input"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group payment-form-group">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    className="form-control payment-input"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary payment-btn"
                  onClick={() => setCurrentSection("payment")}
                >
                  Next
                </button>
              </form>
            </>
          )}

          {currentSection === "payment" && (
            <>
              <h2 className="payment-section-title">Payment Details</h2>
              <form onSubmit={handlePayment}>
                <div className="form-group payment-form-group">
                  <label htmlFor="amount" className="form-label">
                    Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    className="form-control payment-input"
                    value={amount}
                    readOnly
                  />
                </div>
                <div className="form-group payment-form-group">
                  <label htmlFor="cardNumber" className="form-label">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    className="form-control payment-input"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group payment-form-group">
                  <label htmlFor="expiryDate" className="form-label">
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    className="form-control payment-input"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group payment-form-group">
                  <label htmlFor="cvv" className="form-label">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    className="form-control payment-input"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary payment-btn">
                  Pay Now
                </button>
                {error && (
                  <p className="text-danger mt-2 payment-error-message">
                    {error}
                  </p>
                )}
                {success && (
                  <>
                    <p className="text-success mt-2 payment-success-message">
                      {success}
                    </p>
                    {pdfGenerated && (
                      <PDFDownloadLink
                        document={
                          <InvoiceDocument
                            items={items}
                            amount={amount}
                            address={address}
                            city={city}
                            state={state}
                            postalCode={postalCode}
                            country={country}
                          />
                        }
                        fileName="invoice.pdf"
                      >
                        {({ loading }) =>
                          loading ? "Loading document..." : "Download Invoice"
                        }
                      </PDFDownloadLink>
                    )}
                  </>
                )}
                {loading && (
                  <div className="spinner payment-loading-spinner"></div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
