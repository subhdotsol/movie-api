import express, { type Request, type Response } from "express";
import client from "./client.ts";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Movie API",
  });
});

app.post("/register", async (req: Request, res: Response) => {
  // get username and password from request body
  const { username, password } = req.body;

  // if someone tries to register without username or password
  if (!username || !password) {
    return res.json({
      message: "Please provide username and password",
      status: 400,
    });
  }

  // check if username already exists in database
  const existingUser = await client.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return res.json({
      message: "Username already exists please login",
      status: 400,
    });
  }

  // create a new user in the database
  const newUser = await client.user.create({
    data: {
      username,
      password,
    },
  });

  res.json({
    message: "User registered successfully",
  });
});

app.post("/login", async (req: Request, res: Response) => {
  // get username and password from request body
  const { username, password } = req.body;

  // if someone tries to login without username or password
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }

  // check if username already exists in database
  const existingUser = await client.user.findUnique({
    where: { username },
  });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // check if password matches
  if (existingUser.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  console.log(`Login attempt with username: ${username}`);

  return res.json({ message: "Login successful" });
});

app.post("/add-movies", async (req: Request, res: Response) => {
  const { title, year, poster, status, userId } = req.body;

  // save the user to the database
  const user = await client.movie.create({
    data: {
      title,
      year,
      poster,
      status,
      userId,
    },
  });

  res.json({
    message: "Movie added successfully",
    user,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
