let generatedOTP = null;

function sendOTP() {
  const phone = document.getElementById('phone').value;
  const enable = document.getElementById('enableOTP').checked;

  if (!enable) return alert("Please check 'Send OTP to customer'");

  if (!phone || phone.length < 10) return alert("Enter valid phone number");

  generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
  alert(`OTP sent to ${phone}: ${generatedOTP} (Simulated)`);

  document.getElementById('otpSection').style.display = 'block';
  document.getElementById('otpStatus').innerText = '';
}

function verifyOTP() {
  const userOTP = document.getElementById('otpInput').value;

  if (userOTP === generatedOTP) {
    document.getElementById('otpStatus').innerText = '✅ Verified';
    document.getElementById('otpStatus').style.color = 'green';

    const table = document.querySelector("#productTable tbody");
    const row = table.rows[0];

    if (row) {
      const type = row.cells[0].innerText;
      const name = row.cells[1].innerText;
      alert(`Thank you for purchasing ${type} - ${name}\n- M.S MOBILE\nLuna Nagar Bus Stop, Thadagam Road, Edayarpalayam, Coimbatore - 641025\nContact: 8248108883`);
    }

  } else {
    document.getElementById('otpStatus').innerText = '❌ Incorrect OTP';
    document.getElementById('otpStatus').style.color = 'red';
  }
}

function addProduct() {
  const type = document.getElementById('productType').value;
  const name = document.getElementById('productName').value;
  const id = document.getElementById('productId').value;
  const qty = +document.getElementById('qty').value;
  const price = +document.getElementById('price').value;
  if (!name || !qty || !price) return alert("Fill all fields");

  const table = document.querySelector("#productTable tbody");
  const row = table.insertRow();
  row.insertCell(0).innerText = type;
  row.insertCell(1).innerText = name;
  row.insertCell(2).innerText = id;
  row.insertCell(3).innerText = qty;
  row.insertCell(4).innerText = price.toFixed(2);
  row.insertCell(5).innerText = (qty * price).toFixed(2);

  updateTotal();
}

function updateTotal() {
  let total = 0;
  document.querySelectorAll("#productTable tbody tr").forEach(row => {
    total += parseFloat(row.cells[5].innerText);
  });
  document.getElementById("totalCell").innerText = "Rs " + total.toFixed(2);
}

function generateBill() {
  document.querySelectorAll('.no-print').forEach(el => el.style.display = 'none');
  window.print();
  document.querySelectorAll('.no-print').forEach(el => el.style.display = '');
}

function downloadPDF() {
  html2pdf().from(document.getElementById("bill")).save("MS-Mobile-Bill.pdf");
}

function startScanner() {
  document.getElementById("scannerContainer").style.display = "block";
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#scanner")
    },
    decoder: {
      readers: ["code_128_reader", "ean_reader", "ean_8_reader"]
    }
  }, err => {
    if (err) return console.error(err);
    Quagga.start();
  });

  Quagga.onDetected(data => {
    document.getElementById("productId").value = data.codeResult.code;
    stopScanner();
  });
}

function stopScanner() {
  Quagga.stop();
  document.getElementById("scannerContainer").style.display = "none";
}
