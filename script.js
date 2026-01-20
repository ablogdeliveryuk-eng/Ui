(function () {
  // Helper
  const $ = id => document.getElementById(id);
  const formatCurrency = (n) => "$" + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parseAmount = (v) => {
    if (v == null) return NaN;
    if (typeof v === "number") return v;
    try {
      return parseFloat(String(v).replace(/[^0-9.-]+/g, ""));
    } catch (e) { return NaN; }
  };

  // Redirect to login if trying to access dashboard while not logged in
  if (window.location.pathname.endsWith("dashboard.html") && !localStorage.getItem("loggedIn")) {
    window.location.href = "index.html";
    return;
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
        transferPin: "1234",
        emailNotif: true,
        smsNotif: false
      };
      localStorage.setItem("demoUser", JSON.stringify(demoUser));
    }

    // ===== INITIAL TRANSACTIONS =====
    let savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    if (!Array.isArray(savedTransactions) || savedTransactions.length === 0) {
      savedTransactions = [
        { type: "expense", text: "Netflix — Entertainment", amount: "$150.00", date: "2026-01-05", recipient: "Netflix", account: "XXXX", bank: "N/A", note: "" },
        { type: "income", text: "Salary — Deposit", amount: "$69,000.00", date: "2026-01-09", recipient: "Company Inc.", account: "XXXX", bank: "Bank XYZ", note: "" }
      ];
      localStorage.setItem("transactions", JSON.stringify(savedTransactions));
    }

    // Helper: compute total balance from transactions (income - expense)
    function computeBalanceFromTransactions(transactions) {
      return (transactions || []).reduce((acc, tx) => {
        const val = parseAmount(tx.amount);
        if (isNaN(val)) return acc;
        return tx.type === "expense" ? acc - val : acc + val;
      }, 0);
    }

    // ===== TOTAL BALANCE =====
    const balanceEl = document.querySelector(".balance");
    let totalBalance = parseFloat(localStorage.getItem("totalBalance"));

    // Only set manual balance if nothing is stored yet
    if (isNaN(totalBalance)) {
      // Starting balance manually for demo. In production you may compute from transactions.
      totalBalance = 1500450.50;
      localStorage.setItem("totalBalance", String(totalBalance));
    }

    // Update display
    if (balanceEl) balanceEl.textContent = formatCurrency(totalBalance);

    // ===== LOGIN FORM =====
    const loginForm = $("login-form");
    const messageEl = $("login-message");
    if (loginForm) {
      loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const username = $("username").value.trim();
        const password = $("password").value;

        if (!username || !password) {
          if (messageEl) {
            messageEl.style.color = "red";
            messageEl.textContent = "Please enter both username and password.";
          }
          return;
        }

        if (messageEl) {
          messageEl.style.color = "blue";
          messageEl.textContent = "Checking credentials...";
        }

        setTimeout(() => {
          // Demo uses fullName as username (that's intentional in this demo)
          if (username === demoUser.fullName && password === demoUser.password) {
            localStorage.setItem("loggedIn", "true");
            if (messageEl) {
              messageEl.style.color = "green";
              messageEl.textContent = "Login successful! Redirecting...";
            }
            setTimeout(() => window.location.href = "dashboard.html", 500);
          } else {
            if (messageEl) {
              messageEl.style.color = "red";
              messageEl.textContent = "Invalid username or password.";
            }
          }
        }, 500);
      });
    }

    // ===== AUTO REDIRECT IF ALREADY LOGGED IN =====
    if (localStorage.getItem("loggedIn") && window.location.pathname.endsWith("index.html")) {
      window.location.href = "dashboard.html";
      return;
    }

    // ===== DASHBOARD ELEMENTS =====
    const sendForm = $("send-money-form");
    const toggleTransferBtn = $("toggle-transfer-btn");
    const transactionsList = document.querySelector(".transactions-card ul");
    const payBillForm = $("pay-bill-form");
    const requestMoneyForm = $("request-money-form");
    const sendBtn = $("send-btn");

    // Render Transactions (safe: use textContent)
    function renderTransactions() {
      if (!transactionsList) return;
      transactionsList.innerHTML = "";
      savedTransactions.forEach(tx => {
        const amt = parseAmount(tx.amount);
        const li = document.createElement("li");
        if (tx.type) li.classList.add(tx.type);
        const left = document.createElement("span");
        left.textContent = tx.text || "";
        const right = document.createElement("span");
        right.textContent = (tx.type === "expense" ? "- " : "") + formatCurrency(isNaN(amt) ? 0 : amt);
        li.appendChild(left);
        li.appendChild(right);

        const viewBtn = document.createElement("button");
        viewBtn.textContent = "View Receipt";
        viewBtn.style.marginLeft = "10px";
        viewBtn.classList.add("view-receipt-btn");

       // stop propagation so the document click handler doesn't immediately hide the modal
       viewBtn.addEventListener("click", (e) => {
         e.stopPropagation();
         console.log("Transaction clicked:", tx); // <- debug line
         showTransactionReceipt(tx);              // <- call your modal
       });

       li.appendChild(viewBtn);
       transactionsList.insertBefore(li, transactionsList.firstChild);
      });
     }
     renderTransactions();

    // ===== CHART =====
    try {
      const spendingCanvas = $("spendingChart");
      if (spendingCanvas && window.Chart) {
        const ctx = spendingCanvas.getContext("2d");
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let monthlyExpenses = Array(12).fill(0);
        let monthlyIncome = Array(12).fill(0);

        savedTransactions.forEach(tx => {
          try {
            const txDate = tx.date ? new Date(tx.date) : new Date();
            const monthIndex = txDate.getMonth();
            const amountValue = parseAmount(tx.amount);
            if (tx.type === "expense" && !isNaN(amountValue)) monthlyExpenses[monthIndex] += amountValue;
            if (tx.type === "income" && !isNaN(amountValue)) monthlyIncome[monthIndex] += amountValue;
          } catch (e) { console.warn("Skipping invalid transaction:", tx); }
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
    const logoutBtn = $("logout-btn");
    if (logoutBtn) logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      window.location.href = "index.html";
    });

    // ===== PIN MODAL (created once) =====
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

    // Query modal elements after append
    const confirmPinBtn = $("confirmPinBtn");
    const cancelPinBtn = $("cancelPinBtn");
    const transactionPinInput = $("transactionPin");
    const pinMessage = $("pinMessage");
    const maxAttempts = 3;
    let attemptsLeft = maxAttempts;

    // pendingTransaction must be declared before any handler uses it
    // Standard shape: { action: "send"|"pay"|"request", details: {...} }
    let pendingTransaction = null;

    function resetPinState() {
      attemptsLeft = maxAttempts;
      if (pinMessage) pinMessage.textContent = "";
      if (transactionPinInput) transactionPinInput.value = "";
      if (confirmPinBtn) confirmPinBtn.disabled = false;
    }

    function saveTransactionsAndBalance() {
      localStorage.setItem("transactions", JSON.stringify(savedTransactions));
      localStorage.setItem("totalBalance", String(totalBalance));
    }

    // Centralized transaction creation and saving
    // txProps: { type: "income"|"expense", text, amount, recipient, account, bank, note, status }
    function processTransaction(txProps) {
      const amtValue = Number(txProps.amount) || 0;
      if (txProps.type === "expense") totalBalance -= amtValue;
      if (txProps.type === "income" && txProps.status !== "pending") totalBalance += amtValue;

      const txObj = {
        id: Math.floor(Math.random() * 1000000),
        ref: "REF" + Math.floor(100000000 + Math.random() * 900000000),
        type: txProps.type || "income",
        text: txProps.text || "",
        amount: (typeof txProps.amount === "number") ? txProps.amount : txProps.amount || txProps.amount,
        date: new Date().toISOString(),
        status: txProps.status || "completed",
        recipient: txProps.recipient || "",
        account: txProps.account || "",
        bank: txProps.bank || "",
        note: txProps.note || ""
      };

      savedTransactions.unshift(txObj);
      saveTransactionsAndBalance();
      renderTransactions();
      window.lastTransactionDetails = txObj;
      return txObj;
    }

  function showTransactionReceipt(tx) {
  const successModal = $("success-modal");
  if (!successModal || !tx) return;

  // Show modal with proper styling
  successModal.style.display = "flex";
  successModal.style.position = "fixed";
  successModal.style.top = "50%";
  successModal.style.left = "50%";
  successModal.style.transform = "translate(-50%, -50%)";
  successModal.style.zIndex = 2000;

  // Fill modal with transaction info
  const rid = $("r-id"); if (rid) rid.textContent = tx.id || Math.floor(Math.random() * 1000000);
  const rref = $("r-ref"); if (rref) rref.textContent = tx.ref || "REF" + Math.floor(100000000 + Math.random() * 900000000);
  const now = new Date(tx.date ? tx.date : Date.now());
  const rdate = $("r-date"); if (rdate) rdate.textContent = now.toLocaleDateString();
  const rtime = $("r-time"); if (rtime) rtime.textContent = now.toLocaleTimeString('en-US', { hour12: false });

  const ramount = $("r-amount"); if (ramount) ramount.textContent = formatCurrency(parseAmount(tx.amount) || 0);
  const rfee = $("r-fee"); if (rfee) rfee.textContent = "0.00";

  const rrecipient = $("r-recipient");
  const rname = $("r-name");
  if (tx.account || tx.bank) {
    if (rrecipient) rrecipient.textContent = `${tx.recipient || "[Name]"} — ${tx.account || "[Account]"} (${tx.bank || "[Bank]"})`;
    if (rname) rname.textContent = tx.recipient || "[Name]";
  } else {
    if (rrecipient) rrecipient.textContent = tx.recipient || tx.text || "[Name]";
    if (rname) rname.textContent = tx.recipient || tx.text || "[Name]";
  }

  const modalHeading = successModal.querySelector("h2");
  if (modalHeading) {
    modalHeading.textContent = tx.status === "pending" ? "Transaction Pending ⏳" : "Transaction Successful ✔";
  }

  // Save globally for download
  window.lastTransactionDetails = tx;
  }

    // Get elements
const sendForm = document.getElementById("send-money-form");
const confirmModal = document.getElementById("confirm-modal");
const confirmAccount = document.getElementById("confirm-account");
const confirmRecipient = document.getElementById("confirm-recipient");
const cancelConfirm = document.getElementById("cancel-confirm");
const proceedConfirm = document.getElementById("proceed-confirm");

if (sendForm && confirmModal && confirmAccount && confirmRecipient && cancelConfirm && proceedConfirm) {
  // Intercept form submit
  sendForm.addEventListener("submit", function(e) {
    e.preventDefault(); // Stop immediate submission

    // Fill the modal with entered info
    confirmAccount.textContent = document.getElementById("account").value;
    confirmRecipient.textContent = document.getElementById("recipient").value;

    // Show modal
    confirmModal.style.display = "block";
  });

  // Cancel button
  cancelConfirm.addEventListener("click", function() {
    confirmModal.style.display = "none";
  });

  // Proceed button
  proceedConfirm.addEventListener("click", function() {
    confirmModal.style.display = "none";

    // Now actually submit the form or proceed to pin entry
    // We need to call your existing send-money flow here, e.g. trigger submit
    sendForm.dispatchEvent(new Event("submit", { cancelable: true }));
  });
}

    // ===== SEND MONEY =====
    if (sendForm) {
      sendForm.addEventListener("submit", e => {
        e.preventDefault();

        const bankEl = $("bank");
        const accountEl = $("account");
        const recipientEl = $("recipient");
        const amountEl = $("amount");
        const noteEl = $("note");

        if (!bankEl || !accountEl || !recipientEl || !amountEl) return alert("Form is missing fields.");

        const bank = bankEl.value;
        const account = accountEl.value.trim();
        const recipient = recipientEl.value.trim();
        const amount = parseAmount(amountEl.value);
        const note = noteEl ? noteEl.value.trim() : "";

        if (!bank || !account || !recipient || isNaN(amount) || amount <= 0) return alert("Fill all fields correctly.");
        if (amount > totalBalance) return alert("Insufficient funds.");

        // Store pending transaction and open PIN modal. Use action "send" to match PIN handler
        pendingTransaction = {
          action: "send",
          details: {
            recipient: recipient,
            account: account,
            bank: bank,
            amount: amount,
            note: note
          }
        };

        if (pinModal) {
          pinModal.style.display = "flex";
          if (transactionPinInput) transactionPinInput.value = "";
          if (pinMessage) pinMessage.textContent = "";
          attemptsLeft = maxAttempts;
        }
      });
    }

    // ===== PAY BILL =====
    if (payBillForm) {
      payBillForm.addEventListener("submit", e => {
        e.preventDefault();
        const billerEl = $("biller");
        const billAmountEl = $("bill-amount");
        if (!billerEl || !billAmountEl) return alert("Form missing fields.");
        const billText = billerEl.value.trim();
        const billAmount = parseAmount(billAmountEl.value);
        if (!billText || isNaN(billAmount) || billAmount <= 0) return alert("Fill all fields correctly.");
        if (billAmount > totalBalance) return alert("Insufficient funds.");

        pendingTransaction = { action: "pay", details: { billText, billAmount } };
        if (pinModal) {
          pinModal.style.display = "flex";
          if (transactionPinInput) transactionPinInput.value = "";
          if (pinMessage) pinMessage.textContent = "";
          attemptsLeft = maxAttempts;
        }
      });
    }

    // ===== REQUEST MONEY =====
    if (requestMoneyForm) {
      requestMoneyForm.addEventListener("submit", e => {
        e.preventDefault();
        const recipientEl = $("request-recipient");
        const amountEl = $("request-amount");
        if (!recipientEl || !amountEl) return alert("Form missing fields.");
        const recipient = recipientEl.value.trim();
        const amount = parseAmount(amountEl.value);
        if (!recipient || isNaN(amount) || amount <= 0) return alert("Fill all fields correctly.");

        pendingTransaction = { action: "request", details: { recipient, amount } };
        if (pinModal) {
          pinModal.style.display = "flex";
          if (transactionPinInput) transactionPinInput.value = "";
          if (pinMessage) pinMessage.textContent = "";
          attemptsLeft = maxAttempts;
        }
      });
    }

    // ===== PIN CONFIRM =====
    if (confirmPinBtn) {
      confirmPinBtn.addEventListener("click", () => {
        if (!transactionPinInput) return;

        // ===== PIN VALIDATION =====
        if (transactionPinInput.value !== demoUser.transferPin) {
          attemptsLeft--;
          if (pinMessage) pinMessage.textContent = attemptsLeft > 0
            ? `Incorrect PIN. ${attemptsLeft} attempt(s) remaining.`
            : "Maximum attempts reached!";
          transactionPinInput.value = "";
          if (attemptsLeft <= 0) {
            confirmPinBtn.disabled = true;
            setTimeout(() => resetPinState(), 5000);
            setTimeout(() => { if (pinModal) pinModal.style.display = "none"; }, 1000);
          }
          return;
        }

        // PIN correct: hide PIN modal immediately
        if (pinModal) pinModal.style.display = "none";

        if (!pendingTransaction) {
          if (pinMessage) pinMessage.textContent = "No pending transaction.";
          return;
        }

        const { action, details } = pendingTransaction;
        // Normalize bank & account before validation
        details.bank = details.bank.trim().toUpperCase();
        details.account = details.account.trim();

        // Determine target button for processing animation
        let targetBtn = null;
        if (action === "send") targetBtn = sendBtn;
        else if (action === "pay") targetBtn = payBillForm ? payBillForm.querySelector("button[type='submit']") : null;
        else if (action === "request") targetBtn = requestMoneyForm ? requestMoneyForm.querySelector("button[type='submit']") : null;

        // Start processing animation
        if (targetBtn) {
          targetBtn.disabled = true;
          let dots = 0;
          const originalText = targetBtn.textContent;
          const loader = setInterval(() => {
            dots = (dots + 1) % 4;
            targetBtn.textContent = "Processing" + ".".repeat(dots);
          }, 400);

          setTimeout(() => {
            clearInterval(loader);

          // ===== ALLOWED ACCOUNTS (ONLY THESE CAN SUCCEED) =====
          const allowedAccounts = [
          // Chase Bank
          { bank: "CHASE BANK", account: "9876543210" },
          { bank: "CHASE", account: "9876543210" },

          // Bank of America
          { bank: "BANK OF AMERICA", account: "5775319519" },
          { bank: "BOA", account: "5875319519" },

          // Capital One
          { bank: "CAPITAL ONE", account: "3095361077" },
          { bank: "CAPONE", account: "3095361077" }
        ];

          // Check if current transfer is allowed
          const isAllowedAccount =
          action === "send" &&
          allowedAccounts.some(a =>
          a.bank === details.bank &&
          a.account === details.account
         );

            // ===== SPECIAL CASE: Wells Fargo GOES TO ERROR PAGE =====
            if (action === "send" && details.bank === "WEF" && details.account === "15623948807") {
              if (sendForm) sendForm.reset();
              if (toggleTransferBtn) toggleTransferBtn.textContent = "Transfer Funds";
              targetBtn.disabled = false;
              window.location.href = "error.html";
              pendingTransaction = null;
              resetPinState();
              return;
            }

            // ===== BLOCK ALL OTHER RANDOM ACCOUNTS =====
            if (action === "send" && !isAllowedAccount) {
            if (sendForm) sendForm.reset();
            if (toggleTransferBtn) toggleTransferBtn.textContent = "Transfer Funds";
            targetBtn.disabled = false;
            window.location.href = "error.html";
            pendingTransaction = null;
            resetPinState();
            return;
           }

             // ===== PERFORM TRANSACTION =====
            let createdTx = null;
            if (action === "send") {
              const { bank, recipient, amount, note } = details;
              createdTx = processTransaction({
                type: "expense",
                text: `Transfer to ${recipient} (${bank})${note ? " — " + note : ""}`,
                amount: amount,
                recipient,
                account: details.account,
                bank,
                note,
                status: "completed"
              });
              if (sendForm) sendForm.reset();
              if (toggleTransferBtn) toggleTransferBtn.textContent = "Transfer Funds";
            } else if (action === "pay") {
              const { billText, billAmount } = details;
              createdTx = processTransaction({
                type: "expense",
                text: billText,
                amount: billAmount,
                recipient: billText,
                status: "completed"
              });
              if (payBillForm) payBillForm.reset();
            } else if (action === "request") {
              const { recipient, amount } = details;
              // Request: create pending income transaction but DO NOT change balance yet
              const txObj = {
                id: Math.floor(Math.random() * 1000000),
                ref: "REF" + Math.floor(100000000 + Math.random() * 900000000),
                type: "income",
                text: `Request from ${recipient}`,
                amount: amount,
                date: new Date().toISOString(),
                status: "pending",
                recipient: recipient,
                account: details.account || "",
                bank: details.bank || "",
                note: details.note || ""
              };
              savedTransactions.unshift(txObj);
              saveTransactionsAndBalance();
              if (transactionsList) renderTransactions();
              if (requestMoneyForm) requestMoneyForm.reset();
              createdTx = txObj;
            }

            // ===== SHOW SUCCESS MODAL =====
            const successModal = $("success-modal");
            if (successModal && createdTx) {
              successModal.style.display = "flex";
              // Positioning
              successModal.style.position = "fixed";
              successModal.style.top = "50%";
              successModal.style.left = "50%";
              successModal.style.transform = "translate(-50%, -50%)";
              successModal.style.zIndex = 2000;

              window.lastTransactionDetails = createdTx;
              window.lastTransactionAction = action;

              showTransactionReceipt(createdTx);

              const modalHeading = successModal.querySelector("h2");
              if (modalHeading) {
                modalHeading.textContent = action === "request" ? "Transaction Pending ⏳" : "Transaction Successful ✔";
              }
            }

            // Reset button and pending transaction
            targetBtn.disabled = false;
            if (originalText) targetBtn.textContent = originalText;

            pendingTransaction = null;
            resetPinState();
          }, 4000); // 4 seconds processing
        }
      });
    }

    // ===== PIN CANCEL =====
    if (cancelPinBtn) {
      cancelPinBtn.addEventListener("click", () => {
        if (pinModal) pinModal.style.display = "none";
        pendingTransaction = null;
        resetPinState();
      });
    }

    // ===== TOGGLE TRANSFER FORM =====
    if (toggleTransferBtn && sendForm) {
      toggleTransferBtn.addEventListener("click", () => {
        const isVisible = sendForm.style.display === "block";
        sendForm.style.display = isVisible ? "none" : "block";
        toggleTransferBtn.textContent = sendForm.style.display === "block" ? "Hide Transfer Form" : "Transfer Funds";
      });
    }

    // ===== BALANCE TOGGLE =====
    const balanceToggleBtn = $("toggle-balance");
    const sensitiveBalances = document.querySelectorAll(".sensitive");
    let visible = true;
    const originalValues = [];
    sensitiveBalances.forEach(el => originalValues.push(el.textContent));
    if (balanceToggleBtn) balanceToggleBtn.addEventListener("click", () => {
      sensitiveBalances.forEach((el, index) => {
        el.textContent = visible ? "••••••" : originalValues[index];
        el.classList.toggle("hidden", visible);
      });
      balanceToggleBtn.textContent = visible ? "👁‍🗨" : "👁";
      visible = !visible;
    });

    // ===== SUCCESS MODAL & DOWNLOAD RECEIPT =====
    const successModalEl = $("success-modal");
    const closeReceiptBtn = $("close-receipt");
    const downloadReceiptBtn = $("download-receipt");

    if (closeReceiptBtn && successModalEl) closeReceiptBtn.addEventListener("click", () => successModalEl.style.display = "none");

    // updated: ignore clicks from view buttons so they don't immediately close the modal
    document.addEventListener("click", e => {
      if (!successModalEl) return;
      if (successModalEl.style.display !== "flex") return;
      // If click inside modal, do nothing
      if (successModalEl.contains(e.target)) return;
      // If click originated from a view button (or inside it), ignore — that click opens the modal
      if (e.target && e.target.closest && e.target.closest('.view-receipt-btn')) return;
      // Otherwise, clicked outside modal: hide it
      successModalEl.style.display = "none";
    });

    if (downloadReceiptBtn) {
      downloadReceiptBtn.addEventListener("click", () => {
        if (!window.jspdf) return alert("PDF export not available.");
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const details = window.lastTransactionDetails;
        if (!details) return alert("No transaction data available for PDF.");

        // Auto-fill reference number if empty
        if ($("r-ref") && !$("r-ref").textContent) {
          $("r-ref").textContent = details.ref || ("REF" + Math.floor(100000000 + Math.random() * 900000000));
        }

        // Auto-fill time-stamp if empty (UTC)
        if ($("r-time") && !$("r-time").textContent) {
          const now = new Date();
          const hh = now.getUTCHours().toString().padStart(2, "0");
          const mm = now.getUTCMinutes().toString().padStart(2, "0");
          const ss = now.getUTCSeconds().toString().padStart(2, "0");
          $("r-time").textContent = `${hh}:${mm}:${ss} — UTC`;
        }

        // Get all values from the modal (ensures filled correctly)
        const id = $("r-id") ? $("r-id").textContent : ("TX" + Math.floor(100000 + Math.random() * 900000));
        const ref = $("r-ref") ? $("r-ref").textContent : ("REF" + Math.floor(100000000 + Math.random() * 900000000));
        const date = $("r-date") ? $("r-date").textContent : new Date().toLocaleDateString();
        const time = $("r-time") ? $("r-time").textContent : (new Date().toLocaleTimeString("en-US", { hour12: false }) + " — UTC");
        const amount = $("r-amount") ? $("r-amount").textContent : formatCurrency(parseAmount(details.amount) || 0);
        const fee = $("r-fee") ? $("r-fee").textContent : "0.00";
        const recipient = $("r-recipient") ? $("r-recipient").textContent : (details.recipient ? `${details.recipient} — ${details.account || ""} (${details.bank || "N/A"})` : "[Insert Beneficiary Name / Account Details]");

        // PDF styling
        let y = 20; // vertical position start
        // Bank logo (top-left) - optional, will fail silently if not available
        try {
          const logo = new Image();
          logo.src = "chase-logo.png"; // path to your logo
          // addImage may throw if logo isn't loaded; wrap in try
          doc.addImage(logo, "PNG", 20, 12, 35, 12);
        } catch (e) { /* ignore missing logo */ }

        // Watermark
        doc.setTextColor(220);
        doc.setFontSize(40);
        doc.text("CONFIDENTIAL", 105, 150, {
          align: "center",
          angle: 30
        });
        doc.setTextColor(0); // reset color
        doc.setFontSize(18);
        doc.text("JPMORGAN CHASE BANK", 105, y, { align: "center" });
        y += 8;

        doc.setFontSize(14);
        doc.text("PAYMENT RECEIPT", 105, y, { align: "center" });
        y += 6;
        y += 10;
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 10;

        doc.setFontSize(12);
        // Transaction Info
        doc.text(`Transaction ID: ${id}`, 20, y); y += 8;
        doc.text(`Reference Number: ${ref}`, 20, y); y += 8;
        doc.text(`Payment Date: ${date}`, 20, y); y += 8;
        doc.text(`Time‑Stamp: ${time}`, 20, y); y += 12;

        // Transfer Details
        doc.setFontSize(14); doc.text("Transfer Details", 20, y); y += 8;
        doc.setFontSize(12);
        doc.text(`Payment Amount: ${amount}`, 20, y); y += 8;
        doc.text(`Transaction Fee: ${fee}`, 20, y); y += 8;

        // Account Info
        doc.setFontSize(14); doc.text("Account Information", 20, y); y += 8;
        doc.setFontSize(12);
        doc.text("From Account: JPMorgan Chase Bank, N.A. (****8433)", 20, y); y += 8;
        doc.text("SWIFT / BIC: CHASUS33", 20, y); y += 8;

        doc.text(`To Account: ${recipient}`, 20, y);
        y += 12;

        // Authorization Statement
        doc.setFontSize(14); doc.text("Authorization Statement", 20, y); y += 8;
        doc.setFontSize(12);
        const authText = "I hereby confirm that I have authorized an electronic debit from my payment account in the amount stated above. This transaction was approved by the account holder and processed in accordance with applicable banking regulations.";
        const splitAuth = doc.splitTextToSize(authText, 170); // wrap text
        doc.text(splitAuth, 20, y);
        y += splitAuth.length * 7 + 4;

        // Transaction Status
        doc.setFontSize(12);
        doc.text(`Transaction Status: ${details.status || "Completed / Successful"}`, 20, y); y += 12;

        // Footer
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y); y += 6;
        doc.setFontSize(10);
        doc.text("This receipt was generated electronically.", 105, y, { align: "center" });

        // Save PDF
        doc.save(`${id || "receipt"}.pdf`);
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

        if (action === "pay-bill") {
          if (payCard) payCard.style.display = payCard.style.display === "block" ? "none" : "block";
          if (payCard && payCard.style.display === "block") payCard.scrollIntoView({behavior:"smooth",block:"start"});
          if (sendCard) sendCard.style.display = "none";
          if (requestCard) requestCard.style.display = "none";
        }
        if (action === "send-money") {
          if (sendCard) sendCard.style.display = sendCard.style.display === "block" ? "none" : "block";
          if (sendCard && sendCard.style.display === "block") sendCard.scrollIntoView({behavior:"smooth",block:"start"});
          if (payCard) payCard.style.display = "none";
          if (requestCard) requestCard.style.display = "none";
        }
        if (action === "request-money") {
          if (requestCard) requestCard.style.display = requestCard.style.display === "block" ? "none" : "block";
          if (requestCard && requestCard.style.display === "block") requestCard.scrollIntoView({ behavior: "smooth", block: "start" });
          if (sendCard) sendCard.style.display = "none";
          if (payCard) payCard.style.display = "none";
        }
      });
    });

    // ===== PASSWORD CHANGE FORM =====
    const passwordForm = $("password-form");
    if (passwordForm) {
      const passwordMessage = $("password-message");
      passwordForm.addEventListener("submit", e => {
        e.preventDefault();
        const current = $("currentPassword").value;
        const newP = $("newPassword").value;
        const confirmP = $("confirmPassword").value;

        if (current !== demoUser.password) {
          if (passwordMessage) { passwordMessage.textContent = "Current password is incorrect!"; passwordMessage.classList.remove("success"); passwordMessage.classList.add("error"); }
          return;
        }

        if (newP.length < 6) {
          if (passwordMessage) { passwordMessage.textContent = "New password must be at least 6 characters!"; passwordMessage.classList.remove("success"); passwordMessage.classList.add("error"); }
          return;
        }

        if (newP !== confirmP) {
          if (passwordMessage) { passwordMessage.textContent = "New passwords do not match!"; passwordMessage.classList.remove("success"); passwordMessage.classList.add("error"); }
          return;
        }

        demoUser.password = newP;
        localStorage.setItem("demoUser", JSON.stringify(demoUser));
        if (passwordMessage) { passwordMessage.textContent = "Password successfully updated ✔"; passwordMessage.classList.remove("error"); passwordMessage.classList.add("success"); }
        passwordForm.reset();
      });
    }

    // ===== PROFILE PANEL =====
    const profileBtn = $("profile-btn");
    const profilePanel = $("profile-panel");
    const closeProfileBtn = $("close-profile");
    const editProfileBtn = $("edit-profile");
    const accountSettingsBtn = $("account-settings");

    if (profileBtn && profilePanel) {
      profileBtn.addEventListener("click", e => {
        e.stopPropagation();
        profilePanel.style.display = profilePanel.style.display === "block" ? "none" : "block";
      });
    }

    if (closeProfileBtn) closeProfileBtn.addEventListener("click", () => { if (profilePanel) profilePanel.style.display = "none"; });

    document.addEventListener("click", e => {
      if (profilePanel && profilePanel.style.display === "block" && !profilePanel.contains(e.target) && profileBtn && !profileBtn.contains(e.target)) {
        profilePanel.style.display = "none";
      }
    });

    if (editProfileBtn) editProfileBtn.addEventListener("click", () => window.location.href = "profile.html");
    if (accountSettingsBtn) accountSettingsBtn.addEventListener("click", () => window.location.href = "account.html");

  });
})();
