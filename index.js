// Create global userWalletAddress variable
window.userWalletAddress = null;

// when the browser is ready
window.onload = async (event) => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
  } else {
    alert("請安裝 MetaMask 或其他 Ethereum 擴展錢包");
  }

  window.userWalletAddress = window.localStorage.getItem("userWalletAddress");
  showUserDashboard();
};

// Web3 login function
const loginWithEth = async () => {
  if (window.web3) {
    try {
      const selectedAccount = await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => accounts[0])
        .catch(() => {
          throw Error("請選擇一個帳戶");
        });

      window.userWalletAddress = selectedAccount;
      window.localStorage.setItem("userWalletAddress", selectedAccount);
      showUserDashboard();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("找不到錢包");
  }
};

// Function to show the user dashboard
const showUserDashboard = async () => {
  if (!window.userWalletAddress) {
    document.title = "東東大學WiFi 登入";
    document.querySelector(".login-section").style.display = "flex";
    document.querySelector(".dashboard-section").style.display = "none";
    document.querySelector(".receive-section").style.display = "none"; // 隱藏收款區域
    return false;
  }

  document.title = "東東大學WiFi 控制台 🤝";
  document.querySelector(".login-section").style.display = "none";
  document.querySelector(".dashboard-section").style.display = "flex";
  showUserWalletAddress();
  getWalletBalance();
};

// Show the user's wallet address
const showUserWalletAddress = () => {
  const walletAddressEl = document.querySelector(".wallet-address");
  walletAddressEl.innerHTML = window.userWalletAddress;
};

// Get the user's wallet balance
const getWalletBalance = async () => {
  if (!window.userWalletAddress) return false;
  const balance = await window.web3.eth.getBalance(window.userWalletAddress);
  document.querySelector(".wallet-balance").innerHTML = web3.utils.fromWei(
    balance,
    "ether"
  );
};

// Logout function
const logout = () => {
  window.userWalletAddress = null;
  window.localStorage.removeItem("userWalletAddress");
  document.querySelector(".receive-section").style.display = "none"; // 隱藏收款區域
  showUserDashboard();
};

// Generate receiving address and QR code
const generateReceiveAddress = async () => {
  if (!window.userWalletAddress) {
    alert("請先登入錢包");
    return;
  }
  const receiveAddress = window.userWalletAddress;
  document.querySelector(".receive-address").innerText = receiveAddress;
  const qrcodeCanvas = document.getElementById("qrcode");
  qrcodeCanvas.innerHTML = "";
  QRCode.toCanvas(qrcodeCanvas, receiveAddress, { width: 200 }, (error) => {
    if (error) console.error(error);
  });
  document.querySelector(".receive-section").style.display = "block";
};

// Add event listeners
document.querySelector(".login-btn").addEventListener("click", loginWithEth);
document.querySelector(".logout-btn").addEventListener("click", logout);

// Add "Generate Receive Address" button
const receiveButton = document.createElement("button");
receiveButton.innerText = "生成收款地址和QR碼";
receiveButton.classList.add("login-btn");
receiveButton.addEventListener("click", generateReceiveAddress);
document.querySelector(".dashboard-section").appendChild(receiveButton);
