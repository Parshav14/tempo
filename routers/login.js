const express = require("express");
const router = express.Router();
const { mySqlQury } = require("../middleware/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const access = require("../middleware/access");
const countryCodes = require("country-codes-list");

// =========== login ============= //

router.get("/", async (req, res) => {
    try {
        const accessdata = await access(req.user);
        const data = await mySqlQury(`SELECT * FROM tbl_general_settings`);
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = '1' ORDER BY id LIMIT 1`);
        
        res.render("login", {
            data,
            customer_data,
            accessdata,
            success: req.flash('success'),
            errors: req.flash('errors')
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
    }
});

router.post("/login", async (req, res) => {
  console.log("Login route hit");
  try {
    const { email, password, role } = req.body;
    console.log("Login attempt for:", email, "with role:", role);

    let user;
    let roleValue;

    switch (role) {
      case "admin":
        roleValue = "1";
        break;
      case "customer":
        roleValue = "2";
        break;
      case "driver":
        roleValue = "3";
        break;
      default:
        req.flash("errors", "Invalid role selected");
        return res.redirect("/");
    }

    // Check tbl_admin first
    let query = "SELECT * FROM tbl_admin WHERE email = ? AND role = ?";
    let data = await mySqlQury(query, [email, roleValue]);

    // If not found in tbl_admin and role is customer, check tbl_customers
    if (data.length === 0 && role === "customer") {
      query = "SELECT * FROM tbl_customers WHERE email = ?";
      data = await mySqlQury(query, [email]);
    }

    console.log("User data from database:", data);

    if (data.length === 0) {
      console.log("Email not registered or role mismatch");
      req.flash("errors", `Invalid email or role`);
      return res.redirect("/");
    }

    user = data[0];

    console.log("Stored hashed password:", user.password);
    console.log("Provided password:", password);

    try {
      const hash_pass = await bcrypt.compare(password, user.password);
      console.log("Password match:", hash_pass);

      if (!hash_pass) {
        console.log("Incorrect password");
        req.flash("errors", `Your password is wrong`);
        return res.redirect("/");
      }
    } catch (bcryptError) {
      console.error("Bcrypt comparison error:", bcryptError);
      req.flash("errors", `An error occurred during login`);
      return res.redirect("/");
    }

    if (role === "customer" && user.customer_active === "0") {
      console.log("Customer account not active");
      req.flash(
        "errors",
        `Your account is not active. Please wait for approval.`
      );
      return res.redirect("/");
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.first_name,
        email: user.email,
        role: roleValue,
      },
      process.env.TOKEN_KEY
    );
    console.log("JWT token generated");

    res.cookie("jwt", token, { expires: new Date(Date.now() + 60000 * 60) });
    console.log("JWT cookie set");

    if (!req.cookies.lang) {
      const lang_data = jwt.sign({ lang: "en" }, process.env.TOKEN);
      res.cookie("lang", lang_data);
      console.log("Language cookie set");
    }

    req.flash("success", `Login successful`);
    console.log("Login successful. Redirecting to /index");
    return res.redirect("/index");
  } catch (error) {
    console.error("Error in login route:", error);
    req.flash("errors", `An error occurred during login`);
    return res.redirect("/");
  }
});

// =========== lang ============= //

router.get("/lang/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const token = jwt.sign({ lang: req.params.id }, process.env.TOKEN);
    res.cookie("lang", token);

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
  }
});

// =========== customers sign_up ============= //

router.get("/sign_up", async (req, res) => {
  try {
    const accessdata = await access(req.user);
    const data = await mySqlQury(`SELECT * FROM tbl_general_settings`);
    const countries = await mySqlQury(`SELECT * FROM tbl_countries`);
    const states = await mySqlQury(`SELECT * FROM tbl_states`);
    const city = await mySqlQury(`SELECT * FROM tbl_city`);

    const Country_name = countryCodes.customList(
      "countryCode",
      "{countryCode}"
    );
    const nameCode = Object.values(Country_name);

    const myCountryCodesObject = countryCodes.customList(
      "countryCode",
      "+{countryCallingCode}"
    );
    const CountryCode = Object.values(myCountryCodesObject);

    res.render("sign_up", {
      data,
      countries,
      states,
      city,
      accessdata,
      nameCode,
      CountryCode,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while loading the sign-up page");
  }
});

router.get("/country/ajax/:id", async (req, res) => {
  try {
    const state_data = await mySqlQury(
      `SELECT * FROM tbl_states WHERE countries_id = '${req.params.id}'`
    );
    console.log(1111111, state_data);

    res.status(200).json({ state_data });
  } catch (error) {
    console.log(error);
  }
});

router.get("/state/ajax/:id", async (req, res) => {
  try {
    const query = `SELECT * FROM tbl_city WHERE state_id = '${req.params.id}'`;
    const city_data = await mySqlQury(query);
    res.status(200).json({ city_data });
  } catch (error) {
    console.log(error);
  }
});

router.post("/sign_up", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      country_code,
      phone_no,
      password,
      address,
      country,
      state,
      city,
      zip_code,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    let query = `INSERT INTO tbl_admin (first_name, last_name, email, country_code, phone_no, password, role) VALUE (?, ?, ?, ?, ?, ?, 2)`;
    await mySqlQury(query, [
      first_name,
      last_name,
      email,
      country_code,
      phone_no,
      hash,
    ]);

    const admin_data = await mySqlQury(
      `SELECT * FROM tbl_admin WHERE email = ?`,
      [email]
    );

    let customer_data = `INSERT INTO tbl_customers (first_name, last_name, email, country_code, mobile, customers_country, customers_state, customers_city, customers_zipcode, customers_address, customer_active, login_id) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '0', ?)`;
    await mySqlQury(customer_data, [
      first_name,
      last_name,
      email,
      country_code,
      phone_no,
      country,
      state,
      city,
      zip_code,
      address,
      admin_data[0].id,
    ]);

    req.flash(
      "success",
      "Your information has been sent to the administration for approval."
    );
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred during sign-up. Please try again.");
    return res.redirect("/sign_up");
  }
});


// ========== drivers sing_up ========= //

router.get("/sign_up_driver", async (req, res) => {
  console.log("GET /sign_up_driver route hit");
  try {
    const accessdata = await access(req.user);
    const data = await mySqlQury(`SELECT * FROM tbl_general_settings`);

    console.log("Rendering sign_up_driver template with data");
    res.render("sign_up_driver", {
      data: data[0] || {}, // Pass the first item or an empty object if no data
      accessdata,
    });
  } catch (error) {
    console.error("Error in /sign_up_driver route:", error);
    // Render the template with default values if there's an error
    res.render("sign_up_driver", {
      data: { site_title: "SkyCargo", site_logo: "default-logo.png" },
      accessdata: {},
    });
  }
});

router.post("/sign_up_driver", async (req, res) => {
  try {
    const { first_name, last_name, email, phone_no, vehicle_plate, password } =
      req.body;
    console.log("Received sign-up data:", {
      first_name,
      last_name,
      email,
      phone_no,
      vehicle_plate,
    });

    const hash = await bcrypt.hash(password, 10);

    let query = `INSERT INTO tbl_admin (first_name, last_name, email, phone_no, password, role) VALUES (?, ?, ?, ?, ?, 3)`;
    console.log("Executing query:", query);
    const result = await mySqlQury(query, [
      first_name,
      last_name,
      email,
      phone_no,
      hash,
    ]);
    console.log("Admin insert result:", result);

    const admin_data = await mySqlQury(
      `SELECT * FROM tbl_admin WHERE email = ?`,
      [email]
    );
    console.log("Retrieved admin data:", admin_data);

    let drivers_data = `INSERT INTO tbl_drivers (first_name, last_name, email, mobile, vehicle_plate, active, login_id) VALUES (?, ?, ?, ?, ?, '0', ?)`;
    console.log("Executing drivers query:", drivers_data);
    const driversResult = await mySqlQury(drivers_data, [
      first_name,
      last_name,
      email,
      phone_no,
      vehicle_plate,
      admin_data[0].id,
    ]);
    console.log("Drivers insert result:", driversResult);

    req.flash(
      "success",
      `Your information has been sent to the administration for approval.`
    );
    return res.redirect("/");
  } catch (error) {
    console.error("Detailed error in driver sign-up:", error);
    if (error.sqlMessage) {
      console.error("SQL Error:", error.sqlMessage);
    }
    req.flash(
      "error",
      "An error occurred during driver sign-up. Please try again."
    );
    return res.redirect("/sign_up_driver");
  }
});
// =========== logout ============ //
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");

  res.redirect("/");
});

// ========= tracking ============= //

router.get("/tracking", async (req, res) => {
  try {
    const accessdata = await access(req.user);
    console.log(accessdata);
    const general_settings_data = await mySqlQury(
      `SELECT * FROM tbl_general_settings`
    );

    res.render("tracking", {
      general_settings_data: general_settings_data[0],
      accessdata,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/tracking/ajax", async (req, res) => {
  try {
    const { invoice_no, shipment_type } = req.body;

    if (shipment_type == "1") {
      let data =
        await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customer_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customer_lastname
                                                                        FROM tbl_register_packages WHERE invoice ='${invoice_no}'`);

      if (data == "") {
        return res
          .status(200)
          .json({ status: "error", message: "Tracking Number Not Found" });
      }

      const edit_data = await mySqlQury(
        `SELECT * FROM tbl_customers WHERE id = '${data[0].customer}'`
      );
      const country = edit_data[0].customers_country.split(",");
      const city = edit_data[0].customers_city.split(",");
      const address = edit_data[0].customers_address.split(",");

      const countries_list = await mySqlQury("SELECT * FROM tbl_countries");
      const city_list = await mySqlQury("SELECT * FROM tbl_city");

      const tracking_data =
        await mySqlQury(`SELECT tbl_tracking_history.*, (select tbl_countries.countries_name from tbl_countries where tbl_tracking_history.location = tbl_countries.id) as countries_name,
                                                                                (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_tracking_history.delivery_status = tbl_shipping_status.id) as status_name
                                                                                FROM tbl_tracking_history WHERE invoice = '${invoice_no}'`);

      if (shipment_type == "1") {
        res.status(200).json({
          data,
          country,
          city,
          address,
          countries_list,
          city_list,
          tracking_data,
        });
      } else {
        const edit_client_data = await mySqlQury(
          `SELECT * FROM tbl_client WHERE id = '${data[0].client}'`
        );
        const client_country = edit_client_data[0].country.split(",");
        const client_city = edit_client_data[0].city.split(",");
        const client_address = edit_client_data[0].address.split(",");

        res.status(200).json({
          data,
          country,
          city,
          address,
          tracking_data,
          client_country,
          client_city,
          client_address,
          countries_list,
          city_list,
        });
      }
    } else if (shipment_type == "2") {
      let data =
        await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customer_firstname,
                                                                (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customer_lastname,
                                                                (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname
                                                                FROM tbl_shipment WHERE invoice ='${invoice_no}'`);

      if (data == "") {
        return res
          .status(200)
          .json({ status: "error", message: "Tracking Number Not Found" });
      }

      const edit_data = await mySqlQury(
        `SELECT * FROM tbl_customers WHERE id = '${data[0].customer}'`
      );
      const country = edit_data[0].customers_country.split(",");
      const city = edit_data[0].customers_city.split(",");
      const address = edit_data[0].customers_address.split(",");

      const countries_list = await mySqlQury("SELECT * FROM tbl_countries");
      const city_list = await mySqlQury("SELECT * FROM tbl_city");

      const tracking_data =
        await mySqlQury(`SELECT tbl_tracking_history.*, (select tbl_countries.countries_name from tbl_countries where tbl_tracking_history.location = tbl_countries.id) as countries_name,
                                                                                (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_tracking_history.delivery_status = tbl_shipping_status.id) as status_name
                                                                                FROM tbl_tracking_history WHERE invoice = '${invoice_no}'`);

      if (shipment_type == "1") {
        res.status(200).json({
          data,
          country,
          city,
          address,
          countries_list,
          city_list,
          tracking_data,
        });
      } else {
        const edit_client_data = await mySqlQury(
          `SELECT * FROM tbl_client WHERE id = '${data[0].client}'`
        );
        const client_country = edit_client_data[0].country.split(",");
        const client_city = edit_client_data[0].city.split(",");
        const client_address = edit_client_data[0].address.split(",");

        res.status(200).json({
          data,
          country,
          city,
          address,
          tracking_data,
          client_country,
          client_city,
          client_address,
          countries_list,
          city_list,
        });
      }
    } else if (shipment_type == "3") {
      let data =
        await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customer_firstname,
                                                            (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customer_lastname,
                                                            (select tbl_client.first_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_firstname,
                                                            (select tbl_client.last_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_lastname
                                                            FROM tbl_pickup WHERE invoice ='${invoice_no}'`);

      if (data == "") {
        return res
          .status(200)
          .json({ status: "error", message: "Tracking Number Not Found" });
      }

      const edit_data = await mySqlQury(
        `SELECT * FROM tbl_customers WHERE id = '${data[0].customer}'`
      );
      const country = edit_data[0].customers_country.split(",");
      const city = edit_data[0].customers_city.split(",");
      const address = edit_data[0].customers_address.split(",");

      const countries_list = await mySqlQury("SELECT * FROM tbl_countries");
      const city_list = await mySqlQury("SELECT * FROM tbl_city");

      const tracking_data =
        await mySqlQury(`SELECT tbl_tracking_history.*, (select tbl_countries.countries_name from tbl_countries where tbl_tracking_history.location = tbl_countries.id) as countries_name,
                                                                                (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_tracking_history.delivery_status = tbl_shipping_status.id) as status_name
                                                                                FROM tbl_tracking_history WHERE invoice = '${invoice_no}'`);

      if (shipment_type == "1") {
        res.status(200).json({
          data,
          country,
          city,
          address,
          countries_list,
          city_list,
          tracking_data,
        });
      } else {
        const edit_client_data = await mySqlQury(
          `SELECT * FROM tbl_client WHERE id = '${data[0].client}'`
        );
        const client_country = edit_client_data[0].country.split(",");
        const client_city = edit_client_data[0].city.split(",");
        const client_address = edit_client_data[0].address.split(",");

        res.status(200).json({
          data,
          country,
          city,
          address,
          tracking_data,
          client_country,
          client_city,
          client_address,
          countries_list,
          city_list,
        });
      }
    } else if (shipment_type == "4") {
      let data =
        await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customer_firstname,
                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customer_lastname,
                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname
                                                                    FROM tbl_consolidated WHERE invoice ='${invoice_no}'`);

      if (data == "") {
        return res
          .status(200)
          .json({ status: "error", message: "Tracking Number Not Found" });
      }

      const edit_data = await mySqlQury(
        `SELECT * FROM tbl_customers WHERE id = '${data[0].customer}'`
      );
      const country = edit_data[0].customers_country.split(",");
      const city = edit_data[0].customers_city.split(",");
      const address = edit_data[0].customers_address.split(",");

      const countries_list = await mySqlQury("SELECT * FROM tbl_countries");
      const city_list = await mySqlQury("SELECT * FROM tbl_city");

      const tracking_data =
        await mySqlQury(`SELECT tbl_tracking_history.*, (select tbl_countries.countries_name from tbl_countries where tbl_tracking_history.location = tbl_countries.id) as countries_name,
                                                                                (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_tracking_history.delivery_status = tbl_shipping_status.id) as status_name
                                                                                FROM tbl_tracking_history WHERE invoice = '${invoice_no}'`);

      if (shipment_type == "1") {
        res.status(200).json({
          data,
          country,
          city,
          address,
          countries_list,
          city_list,
          tracking_data,
        });
      } else {
        const edit_client_data = await mySqlQury(
          `SELECT * FROM tbl_client WHERE id = '${data[0].client}'`
        );
        const client_country = edit_client_data[0].country.split(",");
        const client_city = edit_client_data[0].city.split(",");
        const client_address = edit_client_data[0].address.split(",");

        res.status(200).json({
          data,
          country,
          city,
          address,
          tracking_data,
          client_country,
          client_city,
          client_address,
          countries_list,
          city_list,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
