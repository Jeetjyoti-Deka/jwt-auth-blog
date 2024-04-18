import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = (req, res) => {
  const { email, password } = req.body;

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const index = jsonData.users.findIndex((user) => user.email === email);

    // checking if the user exist i.e. if the user is already registered
    if (index === -1) {
      res.status(400).send("Email does not exist.");
      return;
    }

    const user = jsonData.users[index];

    // checking if the password is correct
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).send("Incorrect Password");
      return;
    }

    // generating token, since password and email is correct
    const token = jwt.sign({ userId: user.id }, "secret12345", {
      expiresIn: 3 * 24 * 60 * 60, // 3 days
    });

    res.cookie("jwt", token, {
      // sending the token in cookie
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
    });

    res
      .status(200)
      .json({ message: "user logged in", success: true, user: user.id });
  });
};

export const Register = (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    res.status(400).send("Insufficient User Information");
    return;
  }

  // you can provide custom function for checking if the password is strong enough
  // hashing the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const maxId = jsonData.users.reduce(
      (acc, curr) => Math.max(acc, curr.id),
      0
    );

    const newUser = {
      id: maxId + 1,
      username,
      email,
      password: hashedPassword,
    };
    jsonData.users.push(newUser);

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(201).json(newUser);
    });
  });
};

export const Logout = (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.status(200).send("User logged out");
};
