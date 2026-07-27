import { useEffect, useState } from "react";
import "./AdminOrders.css";
import api from "../../utils/api";
import toast from "react-hot-toast";

const statusOptions = ["pending", "shipped", "delivered", "cancelled", "returned"];

function AdminOrders() {
  const [ordersData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  async function getData() {
    const response = await api.get("/orders/all");
    const res = response.data;
    if (res?.success) {
      setOrderData(res.data);
    }
  }

  async function updateStatus(orderId, newStatus) {
    try {
      const response = await api.put("/orders/update", {
        orderId,
        status: newStatus,
      });
      if (response.data.success) {
        toast.success("Order status updated");
        getData();
        setSelectedOrder(null);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error updating order");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="adminOrders">
      <div className="ordersHeader">
        <h1>Orders</h1>
      </div>

      <div className="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {ordersData.map((order) => (
              <tr key={order?._id}>
                <td>#{order?._id?.slice(-6)}</td>

                <td>{new Date(order?.createdAt).toLocaleDateString("en-GB")}</td>

                <td>{order?.userId?.name || "N/A"}</td>

                <td>{order?.items?.length} item(s)</td>

                <td>₹ {(order?.totalOrderValue || order?.items?.[0]?.productId?.price || 0).toLocaleString()}</td>

                <td>{order?.paymentStatus || "Pending"}</td>

                <td>{order?.payementMode || "N/A"}</td>

                <td>
                  <span className={`status ${order?.orderStatus}`}>
                    {order?.orderStatus}
                  </span>
                </td>

                <td>
                  <button className="viewBtn" onClick={() => setSelectedOrder(order)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="orderDetailOverlay" onClick={() => setSelectedOrder(null)}>
          <div className="orderDetailModal" onClick={(e) => e.stopPropagation()}>
            <div className="orderDetailHeader">
              <h2>Order #{selectedOrder._id?.slice(-6)}</h2>
              <button className="closeBtn" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>

            <div className="orderDetailBody">
              <div className="orderInfoGrid">
                <div className="orderInfoItem">
                  <label>Customer</label>
                  <p>{selectedOrder.userId?.name || "N/A"}</p>
                </div>
                <div className="orderInfoItem">
                  <label>Email</label>
                  <p>{selectedOrder.userId?.email || "N/A"}</p>
                </div>
                <div className="orderInfoItem">
                  <label>Date</label>
                  <p>{new Date(selectedOrder.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
                <div className="orderInfoItem">
                  <label>Payment</label>
                  <p>{selectedOrder.payementMode || "N/A"} - {selectedOrder.paymentStatus}</p>
                </div>
                <div className="orderInfoItem">
                  <label>Shipping Address</label>
                  <p>{selectedOrder.shippingAddress || selectedOrder.userId?.address || "N/A"}</p>
                </div>
                <div className="orderInfoItem">
                  <label>Total</label>
                  <p className="totalPrice">₹ {(selectedOrder.totalOrderValue || 0).toLocaleString()}</p>
                </div>
              </div>

              <h3>Items</h3>
              <table className="itemsTable">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Variant</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, i) => (
                    <tr key={i}>
                      <td>{item.productId?.title || "N/A"}</td>
                      <td>{item.quantity}</td>
                      <td>₹ {(item.productId?.price || 0).toLocaleString()}</td>
                      <td>
                        {item.variant?.size && <span>Size: {item.variant.size} </span>}
                        {item.variant?.color && <span>Color: {item.variant.color} </span>}
                        {item.variant?.value && <span>{item.variant.value}</span>}
                        {!item.variant?.size && !item.variant?.color && !item.variant?.value && "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="statusUpdate">
                <h3>Update Status</h3>
                <div className="statusButtons">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      className={`statusBtn ${status === selectedOrder.orderStatus ? "active" : ""}`}
                      onClick={() => updateStatus(selectedOrder._id, status)}
                      disabled={status === selectedOrder.orderStatus}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminOrders;
