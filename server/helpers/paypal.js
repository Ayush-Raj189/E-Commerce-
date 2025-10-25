const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AcppFfqQB1sjTe43ifg7nSe3gMghP1BMYYtP1aHPkU22i39tc6-744SGdMhUXZI-IymuQN2FmZPRMs74",
  client_secret: "EDGAns4HDOh-YVS5LdEhFm7SQRlKkf_9GjJ8FpO474QGg7IM-m2gvFk-Y64Siu6rgtfskRQJ_vJfDdgV",
});

module.exports = paypal;