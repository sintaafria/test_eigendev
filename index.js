const app = require("./server");
const connectDB = require("./src/infra/database");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running at http://localhost:${PORT}`);
		console.log(`Swagger available at http://localhost: ${PORT}/api-docs`);
	});
});
