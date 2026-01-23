// ---------------------------
// Transaction History Data
// ---------------------------
const historyData = [
  { date: "2025-01-14", desc: "Amazon Purchase", amount: "-$1,200", status: "Completed", recipientName: "Amazon Inc.", recipientAccount: "****1234", recipientBank: "Amazon Payments" },
  { date: "2025-02-02", desc: "Salary Credit", amount: "+$4,500", status: "Completed", recipientName: "John Doe", recipientAccount: "****5678", recipientBank: "Chase Bank" },
  { date: "2025-03-11", desc: "Electricity Bill", amount: "-$180", status: "Completed", recipientName: "Electric Co.", recipientAccount: "****1122", recipientBank: "Utility Bank" },
  { date: "2025-04-07", desc: "Wire Transfer", amount: "-$15,000", status: "Completed", recipientName: "Jane Smith", recipientAccount: "****3344", recipientBank: "Bank of America" },
  { date: "2025-05-21", desc: "Investment Dividend", amount: "+$2,300", status: "Completed", recipientName: "XYZ Investments", recipientAccount: "****5566", recipientBank: "Capital One" },
  { date: "2025-06-10", desc: "Netflix Subscription", amount: "-$19.99", status: "Completed", recipientName: "Netflix", recipientAccount: "****7788", recipientBank: "Netflix Payments" },
  { date: "2025-07-03", desc: "ATM Withdrawal", amount: "-$500", status: "Completed", recipientName: "Self", recipientAccount: "****0001", recipientBank: "Chase Bank" },
  { date: "2025-08-16", desc: "Transfer to John Doe", amount: "-$3,200", status: "Completed", recipientName: "John Doe", recipientAccount: "****9876", recipientBank: "Bank of America" },
  { date: "2025-09-09", desc: "Bonus Payment", amount: "+$1,800", status: "Completed", recipientName: "Employer Inc.", recipientAccount: "****1122", recipientBank: "Chase Bank" },
  { date: "2025-10-28", desc: "Online Purchase", amount: "-$750", status: "Completed", recipientName: "Online Shop", recipientAccount: "****3344", recipientBank: "PayPal" },
  // NEW 10 RANDOM TRANSACTIONS
  { date: "2025-11-05", desc: "Spotify Subscription", amount: "-$14.99", status: "Completed", recipientName: "Spotify", recipientAccount: "****5566", recipientBank: "Spotify Payments" },
  { date: "2025-11-12", desc: "Gym Membership", amount: "-$60", status: "Completed", recipientName: "FitGym", recipientAccount: "****7788", recipientBank: "FitBank" },
  { date: "2025-11-15", desc: "Apple Store Purchase", amount: "-$1,250", status: "Completed", recipientName: "Apple Store", recipientAccount: "****9900", recipientBank: "Apple Payments" },
  { date: "2025-11-18", desc: "Dividend Payout", amount: "+$1,200", status: "Completed", recipientName: "XYZ Investments", recipientAccount: "****3344", recipientBank: "Capital One" },
  { date: "2025-11-20", desc: "Uber Ride", amount: "-$25", status: "Completed", recipientName: "Uber", recipientAccount: "****6677", recipientBank: "Uber Payments" },
  { date: "2025-11-23", desc: "Amazon Purchase", amount: "-$320", status: "Completed", recipientName: "Amazon Inc.", recipientAccount: "****1234", recipientBank: "Amazon Payments" },
  { date: "2025-11-25", desc: "PayPal Transfer", amount: "-$400", status: "Completed", recipientName: "Freelancer Jane", recipientAccount: "****5566", recipientBank: "PayPal" },
  { date: "2025-11-27", desc: "Freelance Payment", amount: "+$800", status: "Completed", recipientName: "Self", recipientAccount: "****0001", recipientBank: "Chase Bank" },
  { date: "2025-11-30", desc: "Grocery Store", amount: "-$150", status: "Completed", recipientName: "Grocery Mart", recipientAccount: "****1122", recipientBank: "Local Bank" },
  { date: "2025-12-02", desc: "Charity Donation", amount: "-$200", status: "Completed", recipientName: "Helping Hands", recipientAccount: "****3344", recipientBank: "Charity Bank" }
];

// ---------------------------
// Populate Table
// ---------------------------
const tbody = document.getElementById("history-body");

historyData.forEach(tx => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${tx.date}</td>
    <td>${tx.desc}</td>
    <td>${tx.amount}</td>
    <td>${tx.status}</td>
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

      const modal = document.getElementById("receipt-modal");

      modal.querySelector("#r-date").textContent = tx.date;
      modal.querySelector("#r-desc").textContent = tx.desc;
      modal.querySelector("#r-amount").textContent = tx.amount;
      modal.querySelector("#r-status").textContent = tx.status;
      modal.querySelector("#r-recipient-name").textContent = tx.recipientName;
      modal.querySelector("#r-recipient-account").textContent = tx.recipientAccount;
      modal.querySelector("#r-recipient-bank").textContent = tx.recipientBank;

      modal.style.display = "flex";
    });
  });

  // Close modal
  document.getElementById("close-receipt").addEventListener("click", function() {
    document.getElementById("receipt-modal").style.display = "none";
  });

  // Download PDF
  document.getElementById("download-receipt").addEventListener("click", function() {
    const { jsPDF } = window.jspdf;
    const modal = document.getElementById("receipt-modal");
    const doc = new jsPDF();

    const date = modal.querySelector("#r-date").textContent;
    const desc = modal.querySelector("#r-desc").textContent;
    const amount = modal.querySelector("#r-amount").textContent;
    const status = modal.querySelector("#r-status").textContent;
    const recipientName = modal.querySelector("#r-recipient-name").textContent;
    const recipientAccount = modal.querySelector("#r-recipient-account").textContent;
    const recipientBank = modal.querySelector("#r-recipient-bank").textContent;

    doc.text(`Transaction Receipt`, 20, 20);
    doc.text(`Date: ${date}`, 20, 30);
    doc.text(`Description: ${desc}`, 20, 40);
    doc.text(`Amount: ${amount}`, 20, 50);
    doc.text(`Status: ${status}`, 20, 60);
    doc.text(`Recipient Name: ${recipientName}`, 20, 70);
    doc.text(`Recipient Account: ${recipientAccount}`, 20, 80);
    doc.text(`Recipient Bank: ${recipientBank}`, 20, 90);

    doc.save(`receipt-${date}.pdf`);
  });
}

// Initialize
handleViewReceiptClicks();
