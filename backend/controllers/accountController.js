import { pool } from "../libs/db.js";

export const getAccounts = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    let query, values;

    if (id) {
      // Fetch specific account
      query = {
        text: `SELECT * FROM tableAccount WHERE id = $1 AND user_id = $2`,
        values: [id, userId],
      };
    } else {
      // Fetch all accounts for the user
      query = {
        text: `SELECT * FROM tableAccount WHERE user_id = $1`,
        values: [userId],
      };
    }

    const result = await pool.query(query);

    // If querying specific account and not found
    if (id && result.rowCount === 0) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: id ? result.rows[0] : result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};


export const createAccount = async (req, res) => {
  try {
    const { userId } = req.user;

    const { name, amount, account_number } = req.body;

    const accountExistQuery = {
      text: `SELECT * FROM tableAccount WHERE account_name = $1 AND user_id = $2`,
      values: [name, userId],
    };

    const accountExistResult = await pool.query(accountExistQuery);

    const accountExist = accountExistResult.rows[0];

    if (accountExist) {
      return res
        .status(409)
        .json({ status: "failed", message: "Account already created." });
    }

    const createAccountResult = await pool.query({
      text: `INSERT INTO tableAccount(user_id, account_name, account_number, account_balance) VALUES($1, $2, $3, $4) RETURNING *`,
      values: [userId, name, account_number, amount],
    });
    const account = createAccountResult.rows[0];

    const userAccounts = Array.isArray(name) ? name : [name];

    const updateUserAccountQuery = {
      text: `UPDATE tableUser SET accounts = array_cat(accounts, $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [userAccounts, userId],
    };
    await pool.query(updateUserAccountQuery);

    // Add initial deposit transaction
    const description = account.account_name + " (Initial Deposit)";

    const initialDepositQuery = {
      text: `INSERT INTO tableTransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [
        userId,
        description,
        "income",
        "Completed",
        amount,
        account.account_name,
      ],
    };
    await pool.query(initialDepositQuery);

    res.status(201).json({
      status: "success",
      message: account.account_name + " Account created successfully",
      data: account,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const addMoneyToAccount = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const { amount } = req.body;

    const newAmount = Number(amount);

    const result = await pool.query({
      text: `UPDATE tableAccount SET account_balance =(account_balance + $1), updatedat = CURRENT_TIMESTAMP  WHERE id = $2 RETURNING *`,
      values: [newAmount, id],
    });

    const accountInformation = result.rows[0];

    const description = accountInformation.account_name + " (Deposit)";

    const transQuery = {
      text: `INSERT INTO tableTransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [
        userId,
        description,
        "income",
        "Completed",
        amount,
        accountInformation.account_name,
      ],
    };
    await pool.query(transQuery);

    res.status(200).json({
      status: "success",
      message: "Operation completed successfully",
      data: accountInformation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};