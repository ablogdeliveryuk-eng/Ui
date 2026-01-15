if (
  window.location.pathname.endsWith("dashboard.html") &&
  !localStorage.getItem("loggedIn")
) {
  window.location.href = "index.html";
}
document.addEventListener("DOMContentLoaded", () => {
  // ===== GLOBAL DEMO USER =====
  let demoUser = JSON.parse(localStorage.getItem("demoUser"));
  if (!demoUser) {
    demoUser = {
      fullName: "Charles Williams",
      email: "Charlesweahh@gmail.com",
      phone: "+1 510 367 1796",
      password: "1346000",
      transferPin: "1234", // PIN for transfers and Pay Bill
      emailNotif: true,
      smsNotif: false
    };
    localStorage.setItem("demoUser", JSON.stringify(demoUser));
  }

  // ===== INITIAL TRANSACTIONS =====
  let savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
  if (!savedTransactions.length) {
    savedTransactions = [
      { type: "expense", text: "Netflix — Entertainment", amount: "$150", date: "2026-01-05" },
      { type: "income", text: "Salary — Deposit", amount: "$69000", date: "2026-01-09" }
    ];
    localStorage.setItem("transactions", JSON.stringify(savedTransactions));
  }

  // ===== TOTAL BALANCE =====
  const balanceEl = document.querySelector(".balance");
  let totalBalance = parseFloat(localStorage.getItem("totalBalance"));
  if (!totalBalance) totalBalance = balanceEl ? parseFloat(balanceEl.textContent.replace(/[$,]/g, "")) : 0;
  if (balanceEl) balanceEl.textContent = "$" + totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ===== LOGIN FORM =====
  const loginForm = document.getElementById("login-form");
  const messageEl = document.getElementById("login-message");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      if (!username || !password) {
        messageEl.style.color = "red";
        messageEl.textContent = "Please enter both username and password.";
        return;
      }

      messageEl.style.color = "blue";
      messageEl.textContent = "Checking credentials...";

      setTimeout(() => {
        if (username === demoUser.fullName && password === demoUser.password) {
          localStorage.setItem("loggedIn", "true");
          messageEl.style.color = "green";
          messageEl.textContent = "Login successful! Redirecting...";
          setTimeout(() => window.location.href = "dashboard.html", 500);
        } else {
          messageEl.style.color = "red";
          messageEl.textContent = "Invalid username or password.";
        }
      }, 500);
    });
  }

  // ===== AUTO REDIRECT IF ALREADY LOGGED IN =====
  if (localStorage.getItem("loggedIn") && window.location.pathname.endsWith("index.html")) {
    window.location.href = "dashboard.html";
  }

  // ===== DASHBOARD ELEMENTS =====
    const sendForm = document.getElementById("send-money-form");
    const toggleTransferBtn = document.getElementById("toggle-transfer-btn");
    const transactionsList = document.querySelector(".transactions-card ul");
    const payBillForm = document.getElementById("pay-bill-form");
    const requestMoneyForm = document.getElementById("request-money-form");

    // Render Transactions
    if (transactionsList) {
      transactionsList.innerHTML = "";
      savedTransactions.forEach(tx => {
        const li = document.createElement("li");
        li.classList.add(tx.type);
        li.innerHTML = `<span>${tx.text}</span><span>${tx.amount}</span>`;
        transactionsList.insertBefore(li, transactionsList.firstChild);
      });
    }

    // ===== CHART =====
    try {
      const spendingCanvas = document.getElementById("spendingChart");
      if (spendingCanvas) {
        const ctx = spendingCanvas.getContext("2d");
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let monthlyExpenses = Array(12).fill(0);
        let monthlyIncome = Array(12).fill(0);

        savedTransactions.forEach(tx => {
          try {
            const txDate = tx.date ? new Date(tx.date) : new Date();
            const monthIndex = txDate.getMonth();
            const amountValue = parseFloat(tx.amount.replace(/[-$,]/g,""));
            if (tx.type === "expense" && !isNaN(amountValue)) monthlyExpenses[monthIndex] += amountValue;
            if (tx.type === "income" && !isNaN(amountValue)) monthlyIncome[monthIndex] += amountValue;
          } catch(e) { console.warn("Skipping invalid transaction:", tx); }
        });

        new Chart(ctx, {
          type: "bar",
          data: {
            labels: months,
            datasets: [
              { label: "Expenses", data: monthlyExpenses, backgroundColor: "rgba(217, 69, 69, 0.7)", borderRadius: 6 },
              { label: "Income", data: monthlyIncome, backgroundColor: "rgba(26, 154, 58, 0.7)", borderRadius: 6 }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "top" }, tooltip: { mode: "index", intersect: false } },
            scales: { x: { stacked: false }, y: { stacked: false, beginAtZero: true, ticks: { callback: v => "$" + v.toLocaleString() } } }
          }
        });
      }
    } catch(e) { console.error("Chart error:", e); }

    // ===== LOGOUT =====
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      window.location.href = "index.html";
    });

  // ===== PIN MODAL =====
  const pinModal = document.createElement("div");
  pinModal.id = "pinModal";
  pinModal.style.cssText = "display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;justify-content:center;align-items:center;font-family:Arial,sans-serif;";
  pinModal.innerHTML = `
    <div style="background:#fff;padding:25px 30px;border-radius:15px;width:320px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.2);">
      <h3 style="margin-bottom:15px;color:#333;">Enter PIN</h3>
      <p style="color:#666;font-size:14px;margin-bottom:15px;">For security, enter your 4-digit PIN.</p>
      <input type="password" id="transactionPin" placeholder="••••" style="width:80%;padding:10px;font-size:16px;border-radius:8px;border:1px solid #ccc;text-align:center;letter-spacing:5px;">
      <div style="margin-top:20px;">
        <button id="confirmPinBtn" style="padding:8px 20px;background:#007bff;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;">Confirm</button>
        <button id="cancelPinBtn" style="padding:8px 20px;background:#ccc;color:#333;border:none;border-radius:8px;cursor:pointer;font-size:14px;margin-left:10px;">Cancel</button>
      </div>
      <div id="pinMessage" style="color:red;margin-top:10px;font-size:13px;"></div>
    </div>
  `;
  document.body.appendChild(pinModal);

  const confirmPinBtn = document.getElementById("confirmPinBtn");
  const cancelPinBtn = document.getElementById("cancelPinBtn");
  const transactionPinInput = document.getElementById("transactionPin");
  const pinMessage = document.getElementById("pinMessage");
  const sendBtn = document.getElementById("send-btn");
  const maxAttempts = 3;
  let attemptsLeft = maxAttempts;

  function processTransaction(type, text, amount, status = "completed") {
    const amtValue = parseFloat(amount);
    if (type === "expense") totalBalance -= amtValue;
    if (type === "income") totalBalance += amtValue;

    // Save transaction
    const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    savedTransactions.unshift({
      type: type,
      text: text,
      amount: "$" + amtValue.toFixed(2),
      date: new Date().toISOString().split('T')[0],
      status: status
    });
    localStorage.setItem("transactions", JSON.stringify(savedTransactions));
    localStorage.setItem("totalBalance", totalBalance);

    // Update balance display
    if (balanceEl) balanceEl.textContent = "$" + totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Add to transaction list
    if (transactionsList) {
      const li = document.createElement("li");
      li.classList.add(type);
      li.innerHTML = `<span>${text}</span><span>${type === "expense" ? "-$" : "$"}${amtValue.toLocaleString()}</span>`;
      transactionsList.insertBefore(li, transactionsList.firstChild);
    }

    // Show success modal
    const successModal = document.getElementById("success-modal");
    if (status === "completed" && successModal) {
      successModal.style.display = "flex";
      document.getElementById("r-id").textContent = Math.floor(Math.random() * 1000000);
      document.getElementById("r-name").textContent = text;
      document.getElementById("r-amount").textContent = amtValue.toFixed(2);
      document.getElementById("r-date").textContent = new Date().toLocaleDateString();
    }
  }

  // ===== SEND MONEY =====
  if (sendForm) {
    sendForm.addEventListener("submit", e => {
      e.preventDefault();

      const bank = document.getElementById("bank").value;
      const account = document.getElementById("account").value.trim();
      const recipient = document.getElementById("recipient").value.trim();
      const amount = parseFloat(document.getElementById("amount").value);
      const note = document.getElementById("note").value.trim();

      if (!bank || !account || !recipient || isNaN(amount) || amount <= 0) return alert("Fill all fields correctly.");
      if (amount > totalBalance) return alert("Insufficient funds.");

      // Wells Fargo special case
      if (bank === "WEF" && account === "15623948807") {
        sendBtn.disabled = true;
        let dots = 0;
        sendBtn.textContent = "Processing";
        const loader = setInterval(() => {
          dots = (dots + 1) % 4;
          sendBtn.textContent = "Processing" + ".".repeat(dots);
        }, 400);
        setTimeout(() => {
          clearInterval(loader);
          sendForm.style.display = "none";
          toggleTransferBtn.textContent = "Transfer Funds";
          window.location.href = "error.html";
        }, 4000);
        return;
      }

      // Open PIN modal
      pinModal.style.display = "flex";
      transactionPinInput.value = "";
      pinMessage.textContent = "";
      attemptsLeft = maxAttempts;
    });
  }

  // ===== PIN CONFIRM =====
  confirmPinBtn.addEventListener("click", () => {
    if (transactionPinInput.value !== demoUser.transferPin) {
      attemptsLeft--;
      pinMessage.textContent = attemptsLeft > 0 ? `Incorrect PIN. ${attemptsLeft} attempt(s) remaining.` : "Maximum attempts reached!";
      if (attemptsLeft <= 0) setTimeout(() => pinModal.style.display = "none", 1000);
      transactionPinInput.value = "";
      return;
    }

    // Determine which form is active
    const activeSend = sendForm && sendForm.style.display === "block";
    const activePay = payBillForm && payBillForm.style.display === "block";
    const activeRequest = requestMoneyForm && requestMoneyForm.style.display === "block";

    if (activeSend) {
      const bank = document.getElementById("bank").value;
      const recipient = document.getElementById("recipient").value.trim();
      const amount = parseFloat(document.getElementById("amount").value);
      const note = document.getElementById("note").value.trim();
      processTransaction("expense", `Transfer to ${recipient} (${bank})${note ? " — " + note : ""}`, amount);
      sendForm.reset();
      sendForm.style.display = "none";
      toggleTransferBtn.textContent = "Transfer Funds";
    }

    if (activePay) {
      const billText = document.getElementById("biller").value;
      const billAmount = parseFloat(document.getElementById("bill-amount").value);
      processTransaction("expense", billText, billAmount);
      payBillForm.reset();
      payBillForm.style.display = "none";
    }

    if (activeRequest) {
      const recipient = document.getElementById("request-recipient").value.trim();
      const amount = parseFloat(document.getElementById("request-amount").value);
      processTransaction("income", `Money Requested from ${recipient}`, amount, "pending");
      requestMoneyForm.reset();
      requestMoneyForm.style.display = "none";
    }

    pinModal.style.display = "none";
    transactionPinInput.value = "";
    pinMessage.textContent = "";
  });

  cancelPinBtn.addEventListener("click", () => {
    pinModal.style.display = "none";
    transactionPinInput.value = "";
    pinMessage.textContent = "";
  });

  // ===== TOGGLE TRANSFER FORM =====
  if (toggleTransferBtn && sendForm) {
    toggleTransferBtn.addEventListener("click", () => {
      sendForm.style.display = sendForm.style.display === "block" ? "none" : "block";
      toggleTransferBtn.textContent = sendForm.style.display === "block" ? "Hide Transfer Form" : "Transfer Funds";
    });
  }
}

    // ===== BALANCE TOGGLE =====
    const balanceToggleBtn = document.getElementById("toggle-balance");
    const sensitiveBalances = document.querySelectorAll(".sensitive");
    let visible = true;
    const originalValues = [];
    sensitiveBalances.forEach(el => originalValues.push(el.textContent));
    if (balanceToggleBtn) balanceToggleBtn.addEventListener("click", () => {
      sensitiveBalances.forEach((el, index) => { el.textContent = visible ? "••••••" : originalValues[index]; el.classList.toggle("hidden", visible); });
      balanceToggleBtn.textContent = visible ? "👁‍🗨" : "👁";
      visible = !visible;
    });

    // ===== SUCCESS MODAL & DOWNLOAD RECEIPT =====
    const successModal = document.getElementById("success-modal");
    const closeReceiptBtn = document.getElementById("close-receipt");
    const downloadReceiptBtn = document.getElementById("download-receipt");

    if (closeReceiptBtn) closeReceiptBtn.addEventListener("click", () => successModal.style.display = "none");
    document.addEventListener("click", e => { if (successModal && successModal.style.display === "flex" && !successModal.contains(e.target)) successModal.style.display = "none"; });

    if (downloadReceiptBtn) {
      downloadReceiptBtn.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const id = document.getElementById("r-id").textContent;
        const name = document.getElementById("r-name").textContent;
        const amount = document.getElementById("r-amount").textContent;
        const date = document.getElementById("r-date").textContent;

        doc.setFontSize(18);
        doc.text("Transaction Receipt", 105, 20, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(20, 25, 190, 25);
        doc.setFontSize(12);
        doc.text(`Transaction ID: ${id}`, 20, 40);
        doc.text(`Recipient: ${name}`, 20, 50);
        doc.text(`Amount: ${amount}`, 20, 60);
        doc.text(`Date: ${date}`, 20, 70);
        doc.setFontSize(10);
        doc.text("Thank you for using our service!", 105, 280, { align: "center" });
        doc.save(`${id}.pdf`);
      });
    }

    // ===== QUICK ACTION CARDS =====
    const quickButtons = document.querySelectorAll(".quick-btn");
    quickButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        const payCard = document.querySelector(".pay-bill-card");
        const sendCard = document.querySelector(".send-money-card");
        const requestCard = document.querySelector(".request-money-card");

        if (action === "pay-bill") { if (payCard) payCard.style.display = payCard.style.display === "block" ? "none" : "block"; if (payCard && payCard.style.display === "block") payCard.scrollIntoView({behavior:"smooth",block:"start"}); if(sendCard) sendCard.style.display = "none"; if(requestCard) requestCard.style.display = "none"; }
        if (action === "send-money") { if (sendCard) sendCard.style.display = sendCard.style.display === "block" ? "none" : "block"; if (sendCard && sendCard.style.display === "block") sendCard.scrollIntoView({behavior:"smooth",block:"start"}); if(payCard) payCard.style.display = "none"; if(requestCard) requestCard.style.display = "none"; }
        if (action === "request-money") {
    if (requestCard) requestCard.style.display = requestCard.style.display === "block" ? "none" : "block";
    if (requestCard && requestCard.style.display === "block") {
        requestCard.scrollIntoView({ behavior: "smooth", block: "start" });
}
if (sendCard) sendCard.style.display = "none";
if (payCard) payCard.style.display = "none";
}

// ===== PASSWORD CHANGE FORM =====
const passwordForm = document.getElementById("password-form");
if (passwordForm) {
  const passwordMessage = document.getElementById("password-message");
  passwordForm.addEventListener("submit", e => {
    e.preventDefault();
    const current = document.getElementById("currentPassword").value;
    const newP = document.getElementById("newPassword").value;
    const confirmP = document.getElementById("confirmPassword").value;

    if (current !== demoUser.password) {
      passwordMessage.textContent = "Current password is incorrect!";
      passwordMessage.classList.remove("success");
      passwordMessage.classList.add("error");
      return;
    }

    if (newP.length < 6) {
      passwordMessage.textContent = "New password must be at least 6 characters!";
      passwordMessage.classList.remove("success");
      passwordMessage.classList.add("error");
      return;
    }

    if (newP !== confirmP) {
      passwordMessage.textContent = "New passwords do not match!";
      passwordMessage.classList.remove("success");
      passwordMessage.classList.add("error");
      return;
    }

    demoUser.password = newP;
    localStorage.setItem("demoUser", JSON.stringify(demoUser));
    passwordMessage.textContent = "Password successfully updated ✔";
    passwordMessage.classList.remove("error");
    passwordMessage.classList.add("success");
    passwordForm.reset();
  });
}

// ===== PROFILE PANEL =====
const profileBtn = document.getElementById("profile-btn");
const profilePanel = document.getElementById("profile-panel");
const closeProfileBtn = document.getElementById("close-profile");
const editProfileBtn = document.getElementById("edit-profile");
const accountSettingsBtn = document.getElementById("account-settings");

if (profileBtn && profilePanel) {
  profileBtn.addEventListener("click", e => {
    e.stopPropagation();
    profilePanel.style.display = profilePanel.style.display === "block" ? "none" : "block";
  });
}

if (closeProfileBtn) closeProfileBtn.addEventListener("click", () => profilePanel.style.display = "none");

document.addEventListener("click", e => {
  if (profilePanel && profilePanel.style.display === "block" && !profilePanel.contains(e.target) && !profileBtn.contains(e.target)) {
    profilePanel.style.display = "none";
  }
});

if (editProfileBtn) editProfileBtn.addEventListener("click", () => window.location.href = "profile.html");
if (accountSettingsBtn) accountSettingsBtn.addEventListener("click", () => window.location.href = "account.html");
