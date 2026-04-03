const paymentRows = document.getElementById("payment-rows");
const refundRows = document.getElementById("refund-rows");

let rowToRefund = null; // temporary storage for the row

// Example function to add a payment row
function addPayment(guest, room, dates, status, method, amount, nights) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="px-6 py-4 text-center border-r">${guest}</td>
    <td class="px-6 py-4 text-center border-r">${room}</td>
    <td class="px-6 py-4 text-center border-r">${dates}</td>
    <td class="px-6 py-4 text-center border-r">
      <span class="px-3 py-1 rounded-full text-sm font-semibold ${
        status === "Paid" ? "bg-green-100 text-green-700" :
        status === "Pending" ? "bg-yellow-100 text-yellow-700" :
        "bg-red-100 text-red-700"
      }">${status}</span>
    </td>
    <td class="px-6 py-4 flex justify-center gap-2">
      <button class="view-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
        data-method="${method}" data-amount="${amount}" data-nights="${nights}">View</button>
      <button class="refund-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Refund</button>
    </td>
  `;
  paymentRows.appendChild(tr);
}

// Handle View button
paymentRows.addEventListener("click", function(e) {
  if (e.target.classList.contains("view-btn")) {
    document.getElementById("view-roomtype").textContent = "Room Type: " + e.target.dataset.roomtype;
    document.getElementById("view-roomprice").textContent = "Room Price: ₱ " + e.target.dataset.roomprice;
    document.getElementById("view-method").textContent = "Method: " + e.target.dataset.method;
    document.getElementById("view-nights").textContent = "Nights: " + e.target.dataset.nights;
    document.getElementById("view-finalamount").textContent = "Final Amount: ₱ " + e.target.dataset.finalamount;
    document.getElementById("view-popup").classList.remove("hidden");
  }
});

document.getElementById("close-view").addEventListener("click", () => {
  document.getElementById("view-popup").classList.add("hidden");
});

// Handle Refund button → only show popup
paymentRows.addEventListener("click", function(e) {
  if (e.target.classList.contains("refund-btn")) {
    rowToRefund = e.target.closest("tr"); 
    document.getElementById("refund-popup").classList.remove("hidden"); 
  }
});

// Cancel refund
document.getElementById("cancel-refund").addEventListener("click", () => {
  rowToRefund = null; // reset
  document.getElementById("refund-popup").classList.add("hidden");
});

// Proceed refund
document.getElementById("proceed-refund").addEventListener("click", () => {
  if (rowToRefund) {
    refundRows.appendChild(rowToRefund);
    rowToRefund.querySelector("td:last-child").remove();
    rowToRefund.querySelector("span").textContent = "Cancelled";
    rowToRefund.querySelector("span").className = "px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700";

    // Undo button
    const undoCell = document.createElement("td");
    undoCell.className = "px-6 py-4 text-center";
    undoCell.innerHTML = `<button class="undo-btn bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition cursor-pointer">Undo</button>`;
    rowToRefund.appendChild(undoCell);

    rowToRefund = null; 
  }
  document.getElementById("refund-popup").classList.add("hidden");
});

refundRows.addEventListener("click", function(e) {
  if (e.target.classList.contains("undo-btn")) {
    const row = e.target.closest("tr");
    row.querySelector("td:last-child").remove();
    row.querySelector("span").textContent = "Paid";
    row.querySelector("span").className = "px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700";
    const actionCell = document.createElement("td");
    actionCell.className = "px-6 py-4 flex justify-center gap-2";
    actionCell.innerHTML = `
      <button class="view-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition cursor-pointer">View</button>
      <button class="refund-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer">Refund</button>
    `;
    row.appendChild(actionCell);
    paymentRows.appendChild(row);
  }
});

// Example: Add sample data
addPayment("Juan Dela Cruz", "101", "Mar 25 – Mar 28", "Paid", "Walk-in", "1800", "3");
addPayment("Maria Santos", "202", "Apr 1 – Apr 3", "Pending", "Online", "2300", "2");
addPayment("Jonathan Shun", "101", "Mar 25 – Mar 28", "Paid", "Walk-in", "1800", "3");
addPayment("Jeremy Carl", "202", "Apr 1 – Apr 3", "Pending", "Online", "2300", "2");
addPayment("Trisha Dela Bola", "101", "Mar 25 – Mar 28", "Paid", "Walk-in", "1800", "3");
addPayment("Corndog ni Ate", "202", "Apr 1 – Apr 3", "Pending", "Online", "2300", "2");