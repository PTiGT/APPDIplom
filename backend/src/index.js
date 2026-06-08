require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { ok } = require("./utils/response");
const { notFound, errorHandler } = require("./middleware/error");

const authRoutes = require("./routes/auth");
const languageRoutes = require("./routes/languages");
const guideRoutes = require("./routes/guides");
const articleRoutes = require("./routes/articles");
const categoryRoutes = require("./routes/categories");
const lessonRoutes = require("./routes/lessons");
const topicRoutes = require("./routes/topics");
const challengeRoutes = require("./routes/challenges");
const meRoutes = require("./routes/me");
const documentationRoutes = require("./routes/documentation");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => ok(res, { status: "ok" }));

app.use("/auth", authRoutes);
app.use("/languages", languageRoutes);
app.use("/guides", guideRoutes);
app.use("/articles", articleRoutes);
app.use("/categories", categoryRoutes);
app.use("/topics", topicRoutes);
app.use("/lessons", lessonRoutes);
app.use("/challenges", challengeRoutes);
app.use("/me", meRoutes);
app.use("/documentation", documentationRoutes);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on :${port}`);
});

