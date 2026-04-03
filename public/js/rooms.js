let editingRoom = null;   // Track which room is being edited
let deletingRoom = null;  // Track which room is being deleted

// Price input formatting
const priceInput = document.getElementById("room-price");
priceInput.addEventListener("input", function() {
  this.value = this.value.replace(/[^0-9.]/g, ""); // allow only digits + decimal
});
priceInput.addEventListener("input", function(e) {
  let value = this.value.replace(/[^0-9.]/g, "");
  if (value) {
    let parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (parts[1]) {
      parts[1] = parts[1].substring(0, 2);
    }
    this.value = parts.join(".");
  }
});

// Occupancy button logic
function setupOccupancyButtons() {
  const occupancyField = document.getElementById("room-occupancy");
  document.querySelectorAll(".occupancy-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const occupancy = this.getAttribute("data-occupancy");
      occupancyField.value = occupancy;

      // Reset buttons in same group
      const container = this.closest(".flex");
      container.querySelectorAll(".occupancy-btn").forEach(b => {
        b.classList.remove("bg-green-500","text-white");
        b.classList.add("bg-gray-200","text-gray-800");
      });

      // Highlight clicked
      this.classList.remove("bg-gray-200","text-gray-800");
      this.classList.add("bg-green-500","text-white");
    });
  });
}
setupOccupancyButtons();

// Open popup for Add Room
document.getElementById("add-room-btn").addEventListener("click", () => {
  document.getElementById("room-overlay").classList.remove("hidden");
  document.getElementById("add-room-popup").classList.remove("hidden");
  document.getElementById("add-room-popup").classList.remove("scale-0");
  editingRoom = null;
  document.querySelector("#create-room-form h2").textContent = "Create Room";
});

// Close popup
document.getElementById("close-room-popup").addEventListener("click", () => {
  document.getElementById("room-overlay").classList.add("hidden");
  document.getElementById("add-room-popup").classList.add("hidden");
  document.getElementById("add-room-popup").classList.add("scale-0");
  editingRoom = null;
});

// Close when clicking overlay
document.getElementById("room-overlay").addEventListener("click", () => {
  document.getElementById("room-overlay").classList.add("hidden");
  document.getElementById("add-room-popup").classList.add("hidden");
  document.getElementById("add-room-popup").classList.add("scale-0");
  editingRoom = null;
});

// Handle form submit (Add or Edit)
document.getElementById("create-room-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const type = document.getElementById("room-type").value;
  const price = document.getElementById("room-price").value;
  const desc = document.getElementById("room-desc").value;
  const occupancy = document.getElementById("room-occupancy").value; // single or double
  const picInput = document.getElementById("room-pic");
  let picURL = "placeholder.jpg";

  if (picInput.files && picInput.files[0]) {
    picURL = URL.createObjectURL(picInput.files[0]);
  }

  if (editingRoom) {
    // Update existing room
    editingRoom.querySelector("h3").textContent = `${type} (${occupancy.charAt(0).toUpperCase() + occupancy.slice(1)})`;
    editingRoom.querySelector("h2").textContent = `₱ ${price}`;
    editingRoom.querySelector("p").textContent = desc;
    editingRoom.querySelector("img").src = picURL;
    editingRoom = null;
  } else {
    // Create new room card
    const newRoom = document.createElement("div");
    newRoom.className = "bg-white border-1 rounded-3xl shadow-lg p-6 w-full max-w-[350px] h-[400px] flex flex-col items-center";
    newRoom.innerHTML = `
      <div class="w-full h-[150px] bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">
        <img src="${picURL}" alt="${type}" class="w-full h-full object-cover rounded-lg" />
      </div>
      <div class="text-center">
        <h3 class="text-lg font-bold text-gray-800 mb-2">${type} (${occupancy.charAt(0).toUpperCase() + occupancy.slice(1)})</h3>
        <h2 class="text-lg font-bold text-green-600 mb-2">₱ ${price}</h2>
        <p class="text-gray-600 mb-4">${desc}</p>
      </div>
      <div class="flex gap-3">
        <button class="edit-btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer">Edit</button>
        <button class="delete-btn bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer">Delete</button>
      </div>
    `;
    document.getElementById("room-container").appendChild(newRoom);
  }

  // Close popup
  document.getElementById("room-overlay").classList.add("hidden");
  document.getElementById("add-room-popup").classList.add("hidden");
  document.getElementById("add-room-popup").classList.add("scale-0");

  // Reset form
  this.reset();
  document.getElementById("room-occupancy").value = "single"; // reset to default
});

// Delegate Edit/Delete button clicks
document.getElementById("room-container").addEventListener("click", function(e) {
  if (e.target.classList.contains("edit-btn")) {
    editingRoom = e.target.closest("div.bg-white");
    const titleText = editingRoom.querySelector("h3").textContent;
    // Split out occupancy if present
    const [roomType, occLabel] = titleText.split(" (");
    document.getElementById("room-type").value = roomType.trim();
    if (occLabel) {
      const occ = occLabel.replace(")", "").toLowerCase();
      document.getElementById("room-occupancy").value = occ;
      // highlight correct button
      document.querySelectorAll(".occupancy-btn").forEach(b => {
        b.classList.remove("bg-green-500","text-white");
        b.classList.add("bg-gray-200","text-gray-800");
        if (b.getAttribute("data-occupancy") === occ) {
          b.classList.remove("bg-gray-200","text-gray-800");
          b.classList.add("bg-green-500","text-white");
        }
      });
    }

    document.getElementById("room-price").value = editingRoom.querySelector("h2").textContent.replace("₱ ", "");
    document.getElementById("room-desc").value = editingRoom.querySelector("p").textContent;

    document.getElementById("room-overlay").classList.remove("hidden");
    document.getElementById("add-room-popup").classList.remove("hidden");
    document.getElementById("add-room-popup").classList.remove("scale-0");

    document.querySelector("#create-room-form h2").textContent = "Edit Room";
    document.querySelector("#create-room-form button[type='submit']").textContent = "Update Room";
  }

  if (e.target.classList.contains("delete-btn")) {
    deletingRoom = e.target.closest("div.bg-white");
    document.getElementById("delete-popup").classList.remove("hidden");
  }
});

// Delete confirmation
document.getElementById("cancel-delete").addEventListener("click", () => {
  deletingRoom = null;
  document.getElementById("delete-popup").classList.add("hidden");
});
document.getElementById("confirm-delete").addEventListener("click", () => {
  if (deletingRoom) {
    deletingRoom.remove();
    deletingRoom = null;
  }
  document.getElementById("delete-popup").classList.add("hidden");
});