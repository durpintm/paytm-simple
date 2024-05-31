function getRandomBalance() {
  const randomBalance = 1 + Math.round(Math.random() * 10000);
  return randomBalance;
}

module.exports = {
  getRandomBalance,
};
