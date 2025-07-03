import { pool } from "../libs/db.js";
import { comparePassword, createJWT, hashPassword } from "../libs/index.js";


export const signupUser = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    if (!(firstName || email || password)) {
      return res.status(404).json({
        status: "Failed",
        message: "Provide Required Fields!",
      });
    }

    const userExist = await pool.query({
      text: "SELECT EXISTS (SELECT * FROM tableUser WHERE email = $1)",
      values: [email],
    });

    if (userExist.rows[0].userExist) {
      return res.status(409).json({
        status: "Failed",
        message: "Email Address already exists. Try Login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await pool.query({
      text: `INSERT INTO tableUser (firstname, email, password) VALUES ($1, $2, $3) RETURNING *`,
      values: [firstName, email, hashedPassword],
    });

    user.rows[0].password = undefined;

    res.status(201).json({
      status: "Success",
      message: "User account created successfully",
      user: user.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Failed", message: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email || password)) {
      return res.status(404).json({
        status: "Failed",
        message: "Provide Required Fields!",
      });
    }

    const result = await pool.query({
      text: `SELECT * FROM tableUser WHERE email = $1`,
      values: [email],
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Invalid email or password.",
      });
    }

    const isMatch = await comparePassword(password, user?.password);

    if (!isMatch) {
      return res.status(404).json({
        status: "Failed",
        message: "Invalid email or password",
      });
    }

    const token = createJWT(user.id);

    user.password = undefined;

    res.status(200).json({
      status: "Success",
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Failed", message: error.message });
  }
};