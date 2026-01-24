// ---------------------------
// Transaction History Data
// ---------------------------
const historyData = [
  { date: "2025-01-14", time: "10:15:23", desc: "Amazon Purchase", amount: "-$18,200", status: "Completed", recipientName: "Amazon Inc.", recipientAccount: "****8564", recipientBank: "Amazon Payments", transactionID: "TX-100001", referenceNumber: "REF-500001" },
  { date: "2025-02-02", time: "09:00:00", desc: "Interior Investment", amount: "-$450,500", status: "Completed", recipientName: "Sophia Johnson", recipientAccount: "****7678", recipientBank: "Bank Of America", transactionID: "TX-100002", referenceNumber: "REF-500002" },
  { date: "2025-03-11", time: "14:22:10", desc: "Electricity Bill", amount: "-$180", status: "Completed", recipientName: "Electric Co.", recipientAccount: "****0847", recipientBank: "Wells Fargo", transactionID: "TX-100003", referenceNumber: "REF-500003" },
  { date: "2025-04-07", time: "16:45:30", desc: "Wire Transfer", amount: "-$150,000", status: "Completed", recipientName: "Jane Smith", recipientAccount: "****4463", recipientBank: "Bank of America", transactionID: "TX-100004", referenceNumber: "REF-500004" },
  { date: "2025-05-21", time: "11:30:12", desc: "Investment Dividend", amount: "+$200,300", status: "Completed", recipientName: "Furniture Investments", recipientAccount: "****0867", recipientBank: "Capital One", transactionID: "TX-100005", referenceNumber: "REF-500005" },
  { date: "2025-06-10", time: "08:50:45", desc: "Netflix Subscription", amount: "-$19.99", status: "Completed", recipientName: "Netflix", recipientAccount: "****7878", recipientBank: "Netflix Payments", transactionID: "TX-100006", referenceNumber: "REF-500006" },
  { date: "2025-07-03", time: "12:05:18", desc: "ATM Withdrawal", amount: "-$15,500", status: "Completed", recipientName: "Self", recipientAccount: "****9088", recipientBank: "Chase Bank", transactionID: "TX-100007", referenceNumber: "REF-500007" },
  { date: "2025-08-16", time: "13:15:50", desc: "Transfer to Sarah Martinez", amount: "-$35,200", status: "Completed", recipientName: "Sarah Martinez", recipientAccount: "****9876", recipientBank: "Bank of America", transactionID: "TX-100008", referenceNumber: "REF-500008" },
  { date: "2025-09-09", time: "15:40:33", desc: "Bonus Payment", amount: "+$118,000", status: "Completed", recipientName: "Employer Inc.", recipientAccount: "****6564", recipientBank: "Chase Bank", transactionID: "TX-100009", referenceNumber: "REF-500009" },
  { date: "2025-10-28", time: "17:20:55", desc: "Online Purchase", amount: "-$1,750", status: "Completed", recipientName: "Online Shop", recipientAccount: "****2498", recipientBank: "Wells Fargo", transactionID: "TX-100010", referenceNumber: "REF-500010" },
  { date: "2025-11-05", time: "09:30:10", desc: "Spotify Subscription", amount: "-$14.99", status: "Completed", recipientName: "Spotify", recipientAccount: "****7765", recipientBank: "Spotify Payments", transactionID: "TX-100011", referenceNumber: "REF-500011" },
  { date: "2025-11-12", time: "07:45:25", desc: "Gym Membership", amount: "-$160", status: "Completed", recipientName: "FitGym", recipientAccount: "****7945", recipientBank: "FitBank", transactionID: "TX-100012", referenceNumber: "REF-500012" },
  { date: "2025-11-15", time: "11:10:44", desc: "Apple Store Purchase", amount: "-$1,250", status: "Completed", recipientName: "Apple Store", recipientAccount: "****0678", recipientBank: "Apple Payments", transactionID: "TX-100013", referenceNumber: "REF-500013" },
  { date: "2025-11-18", time: "12:55:18", desc: "Dividend Payout", amount: "+$120000", status: "Completed", recipientName: "Furniture Investments", recipientAccount: "****5644", recipientBank: "Capital One", transactionID: "TX-100014", referenceNumber: "REF-500014" },
  { date: "2025-11-20", time: "10:05:33", desc: "Uber Ride", amount: "-$25", status: "Completed", recipientName: "Uber", recipientAccount: "****6671", recipientBank: "Uber Payments", transactionID: "TX-100015", referenceNumber: "REF-500015" },
  { date: "2025-11-23", time: "14:40:12", desc: "Amazon Purchase", amount: "-$30,200", status: "Completed", recipientName: "Amazon Inc.", recipientAccount: "****7455", recipientBank: "Amazon Payments", transactionID: "TX-100016", referenceNumber: "REF-500016" },
  { date: "2025-11-25", time: "16:10:50", desc: "PayPal Transfer", amount: "-$40,000", status: "Completed", recipientName: "Jennifer Jackson", recipientAccount: "****4573", recipientBank: "PNC Bank", transactionID: "TX-100017", referenceNumber: "REF-500017" },
  { date: "2025-11-27", time: "13:20:05", desc: "Freelance Payment", amount: "+$180000", status: "Completed", recipientName: "Donald Freeman", recipientAccount: "****9675", recipientBank: "Chase Bank", transactionID: "TX-100018", referenceNumber: "REF-500018" },
  { date: "2025-11-30", time: "08:50:40", desc: "Grocery Store", amount: "-$15,000", status: "Completed", recipientName: "Grocery Mart", recipientAccount: "****8799", recipientBank: "Bank Of America", transactionID: "TX-100019", referenceNumber: "REF-500019" },
  { date: "2025-12-02", time: "10:30:20", desc: "Charity Donation", amount: "-$20,000", status: "Completed", recipientName: "Helping Hands", recipientAccount: "****0874", recipientBank: "Citi Bank", transactionID: "TX-100020", referenceNumber: "REF-500020" },
  { date: "2026-01-05", time: "05:25:00", desc: "Netflix — Entertainment", amount: "-$150,00", status: "Completed", recipientName: "Netflix, Inc.", recipientAccount: "Charlesweahh@gmail.com", recipientBank: "Bank Of America", transactionID: "100001", referenceNumber: "REF100001" },
  { date: "2026-01-09", time: "01:11:25", desc: "Interior — Blessed", amount: "-$69,000", status: "Completed", recipientName: "Studio O+A, Inc.", recipientAccount: "****2651", recipientBank: "Bank Of America", transactionID: "100002", referenceNumber: "REF100002" },
  { date: "2026-01-23", time: "10:30:00", desc: "Profit distribution from interior design & furniture investment", amount: "+$500,000", status: "Completed", recipientName: "Charles Williams", recipientAccount: "****8433", recipientBank: "Chase Bank", transactionID: "100811", referenceNumber: "REF2026023" }
];

// ---------------------------
// Populate Table with colors
// ---------------------------
const tbody = document.getElementById("history-body");

// Function to get From/To accounts dynamically
function getFromToAccounts(tx) {
  const yourAccountName = "JPMorgan Chase Bank, N.A.";
  const yourAccountNumber = "****8433";

  if (tx.amount.startsWith("+")) {
    // INCOME: From sender → To your account
    return {
      fromName: tx.recipientName,
      fromAccount: tx.recipientAccount,
      toName: "Your Account",
      toAccount: `${yourAccountName} (${yourAccountNumber})`,
      toBank: yourAccountName // <--- corrected recipient bank
    };
  } else {
    // EXPENSE: From your account → To recipient
    return {
      fromName: "Your Account",
      fromAccount: `${yourAccountName} (${yourAccountNumber})`,
      toName: tx.recipientName,
      toAccount: tx.recipientAccount,
      toBank: tx.recipientBank
    };
  }
}

// Populate table with all details including From/To
historyData.forEach(tx => {
  const accounts = getFromToAccounts(tx);
  const row = document.createElement("tr");

  let amountClass = tx.amount.startsWith("+") ? "income" : "expense";

  row.innerHTML = `
    <td>${tx.date}</td>
    <td>${tx.desc}</td>
    <td class="${amountClass}">${tx.amount}</td>
    <td>${tx.status}</td>
    <td>From: ${accounts.fromName} (${accounts.fromAccount})<br>To: ${accounts.toName} (${accounts.toAccount})</td>
    <td><button class="receipt-btn">View Receipt</button></td>
  `;
  tbody.appendChild(row);
});

// ---------------------------
// Handle View Receipt Clicks
// ---------------------------
function handleViewReceiptClicks() {
  document.querySelectorAll(".receipt-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const row = btn.closest("tr");
      const index = Array.from(tbody.children).indexOf(row);
      const tx = historyData[index];

      const accounts = getFromToAccounts(tx);

      const modal = document.getElementById("receipt-modal");

      modal.innerHTML = `
        <div style="background:#fff; padding:20px; width:350px; margin:auto; position:relative;">
          <span id="close-receipt" style="position:absolute; top:10px; right:10px; cursor:pointer;">&times;</span>
          <h2>Transaction Successful ✔</h2>

          <p><strong>Transaction ID:</strong> ${tx.transactionID}</p>
          <p><strong>Reference Number:</strong> ${tx.referenceNumber}</p>
          <p><strong>Payment Date:</strong> ${tx.date}</p>
          <p><strong>Time‑Stamp:</strong> ${tx.time}</p>

          <hr>

          <h3>Transfer Details</h3>
          <p><strong>Payment Amount:</strong> ${tx.amount}</p>
          <p><strong>Transaction Fee:</strong> $0.00</p>

          <hr>

          <h3>Account Information</h3>
          <p><strong>From Account:</strong> ${accounts.fromName} (${accounts.fromAccount})</p>
          <p><strong>To Account:</strong> ${accounts.toName} (${accounts.toAccount})</p>
          <p><strong>Recipient Bank:</strong> ${accounts.toBank || tx.recipientBank}</p>

          <hr>

          <h3>Authorization Statement</h3>
          <p>
            I hereby confirm that I have authorized an electronic debit from my payment account in the amount stated above.
            This transaction was approved by the account holder and processed in accordance with applicable banking regulations.
          </p>

          <hr>

          <p><strong>Transaction Status:</strong> ${tx.status}</p>

          <hr>

          <small>This receipt was generated electronically.</small>

          <div class="receipt-actions">
            <button id="download-receipt">Download Receipt</button>
          </div>
        </div>
      `;

      modal.style.display = "flex";

      modal.querySelector("#close-receipt").addEventListener("click", () => {
        modal.style.display = "none";
      });

      modal.querySelector("#download-receipt").addEventListener("click", () => {
        if (!window.jspdf) return alert("PDF export not available.");
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let y = 20;

        try {
          const logo = new Image();
          logo.src = "chase-logo.png";
          doc.addImage(logo, "PNG", 20, 12, 35, 12);
        } catch(e){}

        doc.setTextColor(220);
        doc.setFontSize(40);
        doc.text("CONFIDENTIAL", 105, 150, { align: "center", angle: 30 });
        doc.setTextColor(0);

        doc.setFontSize(18);
        doc.text("JPMORGAN CHASE BANK", 105, y, { align: "center" });
        y += 8;
        doc.setFontSize(14);
        doc.text("PAYMENT RECEIPT", 105, y, { align: "center" });
        y += 16;

        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 10;

        doc.setFontSize(12);
        doc.text(`Transaction ID: ${tx.transactionID}`, 20, y); y+=8;
        doc.text(`Reference Number: ${tx.referenceNumber}`, 20, y); y+=8;
        doc.text(`Payment Date: ${tx.date}`, 20, y); y+=8;
        doc.text(`Time‑Stamp: ${tx.time}`, 20, y); y+=12;

        doc.setFontSize(14); doc.text("Transfer Details", 20, y); y+=8;
        doc.setFontSize(12);
        doc.text(`Payment Amount: ${tx.amount}`, 20, y); y+=8;
        doc.text(`Transaction Fee: $0.00`, 20, y); y+=8;

        doc.setFontSize(14); doc.text("Account Information", 20, y); y+=8;
        doc.setFontSize(12);
        doc.text(`From Account: ${accounts.fromName} (${accounts.fromAccount})`, 20, y); y+=8;
        doc.text(`To Account: ${accounts.toName} (${accounts.toAccount})`, 20, y); y+=8;
        doc.text(`Recipient Bank: ${accounts.toBank || tx.recipientBank}`, 20, y); y+=12;

        doc.setFontSize(14); doc.text("Authorization Statement", 20, y); y+=8;
        doc.setFontSize(12);
        const authText = "I hereby confirm that I have authorized an electronic debit from my payment account in the amount stated above. This transaction was approved by the account holder and processed in accordance with applicable banking regulations.";
        const splitAuth = doc.splitTextToSize(authText, 170);
        doc.text(splitAuth, 20, y);
        y += splitAuth.length * 7 + 4;

        doc.setFontSize(12);
        doc.text(`Transaction Status: ${tx.status}`, 20, y); y+=12;

        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y); y+=6;
        doc.setFontSize(10);
        doc.text("This receipt was generated electronically.", 105, y, { align: "center" });

        doc.save(`${tx.transactionID}.pdf`);
      });
    });
  });
}

// Initialize
handleViewReceiptClicks();
