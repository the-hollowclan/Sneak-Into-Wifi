document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.querySelector(".wifi-list");
  const refreshBtn = document.querySelector(".refresh");

  const modal = document.createElement("div");
  modal.className = "wifi-modal hidden";
  modal.innerHTML = `
    <div class="modal-content">
      <h2 id="modal-title"></h2>
      <form id="connect-form">
        <input type="password" id="wifi-password" placeholder="Password(unchanged)" />
        <button type="submit">Connect</button>
      </form>
      <!--button class="close-modal">Cancel</button-->
    </div>
  `;
  document.body.appendChild(modal);

  const modalTitle = modal.querySelector("#modal-title");
  const passwordField = modal.querySelector("#wifi-password");
  const connectForm = modal.querySelector("#connect-form");
  const closeBtn = modal.querySelector(".close-modal");

  async function fetchNetworks() {
    refreshBtn.textContent = "Refreshing...";
    refreshBtn.disabled = true;
    try {
      const res = await fetch("/api/networks");
      const data = await res.json();
      updateNetworkList(data);
    } catch (err) {
      console.error("Failed to fetch networks:", err);
    } finally {
      refreshBtn.textContent = "🔄 Refresh Networks";
      refreshBtn.disabled = false;
    }
  }

  function updateNetworkList(networks) {
    listContainer.innerHTML = "";
    networks.forEach(net => {
      const item = document.createElement("div");
      item.className = `wifi-item ${net.secured ? "locked" : ""}`;
      item.innerHTML = `
        <div class="wifi-name">${net.ssid}</div>
        <div class="wifi-signal signal-${net.signal}"></div>
      `;
      item.addEventListener("click", () => openModal(net));
      listContainer.appendChild(item);
    });
  }

    function openModal(net) {
    modalTitle.textContent = `Connect to "${net.ssid}"`;
    modal.dataset.ssid = net.ssid;
    passwordField.value = "";

    const oldUserField = modal.querySelector("#wifi-username");
    if (oldUserField) oldUserField.remove();

    if (net.enterprise) {
        const userField = document.createElement("input");
        userField.type = "text";
        userField.id = "wifi-username";
        userField.placeholder = "Enter username or ID";
        userField.style.marginBottom = "0.8rem";
        connectForm.prepend(userField);
    }

    modal.classList.remove("hidden");
    }

    connectForm.addEventListener("submit", async e => {
    e.preventDefault();
    const ssid = modal.dataset.ssid;
    const password = passwordField.value;
    const usernameInput = modal.querySelector("#wifi-username");
    const username = usernameInput ? usernameInput.value : null;

    try {
        const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssid, password, username })
        });
        const data = await res.json();
        alert(data.message || "Connection attempt sent!");
    } catch (err) {
        console.error("Failed to connect:", err);
    } finally {
        closeModal();
    }
    });

  //closeBtn.addEventListener("click", closeModal);
  refreshBtn.addEventListener("click", fetchNetworks);

  fetchNetworks();
});
