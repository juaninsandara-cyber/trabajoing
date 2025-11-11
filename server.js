const app = require("./app");
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Servidor de pagos QR ejecutándose");
  console.log("📍 Puerto: " + PORT);
  console.log("📱 URL: http://localhost:" + PORT);
  console.log("🌐 Network: http://0.0.0.0:" + PORT);
});

// Manejar cierre graceful
process.on("SIGINT", () => {
  console.log("\n🛑 Servidor apagado");
  process.exit(0);
});
