const QRCode = require("../src");

QRCode.toString("yo yo yo", function (error, data) {
  if (error) {
    throw new Error(error);
  }

  console.log(data);
});
