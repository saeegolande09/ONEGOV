const express = require("express");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const connectDB = require("./config/db");
const UserGovernmentProfile = require("./models/application");
const GovernmentApplication = require("./models/governmentApplication");
const Consent = require("./models/consent");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const i18n = require("i18n");

i18n.configure({
  locales: ["en", "hi", "mr"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  cookie: "lang",
  queryParameter: "lang",
  autoReload: true,
  updateFiles: false
});

app.use(i18n.init);


// ===============================
// i18n MULTI-LANGUAGE SETUP
// ===============================


// ===============================
// GOVERNMENT PORTALS
// ===============================

const portals = {
  identity: {
    name: "National Identity & Address Portal",
    view: "identity",
    error: "Failed to load Identity Portal."
  },

  income: {
    name: "Revenue & Income Assessment Portal",
    view: "income",
    error: "Failed to load Income Portal."
  },

  education: {
    name: "Educational Qualifications Registry",
    view: "education",
    error: "Failed to load Education Portal."
  },

  health: {
    name: "National Health Authority (ABHA)",
    view: "health",
    error: "Failed to load Health Portal."
  },

  caste: {
    name: "Social Welfare & Caste Certificate Portal",
    view: "caste",
    error: "Failed to load Caste Certificate Portal."
  },

  drivingLicense: {
    name: "Transport Department (RTO)",
    view: "drivingLicense",
    error: "Failed to load Driving License Portal."
  },

  land: {
    name: "Land Records & Revenue Department",
    view: "land",
    error: "Failed to load Land Records Portal."
  },

  businessAndTax: {
    name: "Taxation & Business Registry (GST/PAN)",
    view: "businessAndTax",
    error: "Failed to load Business & Tax Portal."
  },

  employment: {
    name: "Employment Exchange Board",
    view: "employment",
    error: "Failed to load Employment Portal."
  },

  applicationStatus: {
    name: "Unified Scheme & Application Tracker",
    view: "applicationStatus",
    error: "Failed to load Application Status Portal."
  }
};

// ===============================
// GENERATE NATIONAL ID
// ===============================

const generateNationalId = async () => {
  while (true) {
    const number = crypto.randomInt(10000000, 100000000);

    const letter = String.fromCharCode(
      65 + crypto.randomInt(0, 26)
    );

    const nationalId = `IND-${number}-${letter}`;

    const existingUser = await User.findOne({
      nationalId
    });

    const existingProfile = await UserGovernmentProfile.findOne({
      nationalId
    });

    if (!existingUser && !existingProfile) {
      return nationalId;
    }
  }
};

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.redirect("/login");
});

// ===============================
// LOGIN
// ===============================

app.get("/login", (req, res) => {
  res.render("login", {
    error: null
  });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("login", {
        error: "Email/Mobile and password are required."
      });
    }

    const loginValue = email.trim();

    const user = await User.findOne({
      $or: [
        {
          email: loginValue.toLowerCase()
        },
        {
          mobile: loginValue
        }
      ]
    });

    if (!user || user.password !== password) {
      return res.render("login", {
        error: "Invalid email/mobile or password."
      });
    }

    if (!user.nationalId) {
      return res.status(400).send(
        "This account is not linked to a government profile."
      );
    }

    const citizen = await UserGovernmentProfile.findOne({
      nationalId: user.nationalId.trim()
    });

    if (!citizen) {
      return res.status(404).send(
        "Government profile not found for this account."
      );
    }

    return res.redirect(
      `/dashboard?nationalId=${encodeURIComponent(citizen.nationalId)}`
    );

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).send(
      "Login failed."
    );
  }
});

// ===============================
// DASHBOARD
// ===============================

app.get("/dashboard", async (req, res) => {
  try {
    const { nationalId } = req.query;

    if (!nationalId) {
      return res.redirect("/login");
    }

    const citizen = await UserGovernmentProfile.findOne({
      nationalId: nationalId.trim()
    });

    if (!citizen) {
      return res.status(404).send(
        "Government profile not found."
      );
    }

    const applications = await GovernmentApplication.find({
      nationalId: citizen.nationalId
    }).sort({
      createdAt: -1
    });

    return res.render("dashboard", {
      citizen,
      applications
    });

  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).send(
      "Failed to load dashboard."
    );
  }
});

// ===============================
// VERIFY CITIZEN
// ===============================

app.get("/verify-citizen", async (req, res) => {
  try {
    const { nationalId, fullName } = req.query;

    if (!nationalId || !fullName) {
      return res.render("index", {
        error: "National ID and Full Name are required.",
        citizen: null,
        availablePortals: []
      });
    }

    const citizen = await UserGovernmentProfile.findOne({
      nationalId: nationalId.trim(),

      "identity.fullName": {
        $regex: new RegExp(`^${fullName.trim()}$`, "i")
      }
    });

    if (!citizen) {
      return res.render("index", {
        error: "Citizen record not found with provided details.",
        citizen: null,
        availablePortals: []
      });
    }

    return res.render("index", {
      error: null,

      citizen: {
        nationalId: citizen.nationalId,
        fullName: citizen.identity.fullName
      },

      availablePortals: Object.keys(portals).map(key => ({
        key,
        name: portals[key].name
      }))
    });

  } catch (error) {
    console.error("Verification Error:", error);

    return res.render("index", {
      error: "Citizen verification failed.",
      citizen: null,
      availablePortals: []
    });
  }
});

// ===============================
// GOVERNMENT PORTAL ROUTES
// ===============================

Object.keys(portals).forEach(key => {

  app.get(`/portal/${key}`, async (req, res) => {

    try {

      const { nationalId } = req.query;

      if (!nationalId) {
        return res.send(
          "National ID is required."
        );
      }

      const citizen = await UserGovernmentProfile.findOne({
        nationalId: nationalId.trim()
      });

      if (!citizen) {
        return res.send(
          "Citizen record not found."
        );
      }

      let extraData = {};

      if (key === "applicationStatus") {

        extraData.applications =
          await GovernmentApplication.find({
            nationalId: citizen.nationalId
          }).sort({
            createdAt: -1
          });
      }

      return res.render(
        portals[key].view,
        {
          citizen,
          ...extraData
        }
      );

    } catch (error) {

      console.error(
        `${key} Error:`,
        error
      );

      return res.status(500).send(
        portals[key].error
      );
    }

  });

});

// ===============================
// SERVICES
// ===============================

app.get("/services", async (req, res) => {

  try {

    const { nationalId } = req.query;

    if (!nationalId) {
      return res.send(
        "National ID is required."
      );
    }

    const citizen =
      await UserGovernmentProfile.findOne({
        nationalId: nationalId.trim()
      });

    if (!citizen) {
      return res.send(
        "Citizen record not found."
      );
    }

    return res.render(
      "serviceApplication",
      {
        citizen
      }
    );

  } catch (error) {

    console.error(
      "Services Error:",
      error
    );

    return res.status(500).send(
      "Failed to load Government Services."
    );
  }

});

// ===============================
// CONSENT
// ===============================

app.get("/consent", async (req, res) => {

  try {

    const {
      nationalId,
      serviceType,
      serviceName,
      department
    } = req.query;

    if (
      !nationalId ||
      !serviceType ||
      !serviceName ||
      !department
    ) {

      return res.send(
        "Required consent details are missing."
      );
    }

    const citizen =
      await UserGovernmentProfile.findOne({
        nationalId: nationalId.trim()
      });

    if (!citizen) {
      return res.send(
        "Citizen record not found."
      );
    }

    return res.render(
      "consent",
      {
        citizen,
        serviceType,
        serviceName,
        department
      }
    );

  } catch (error) {

    console.error(
      "Consent Error:",
      error
    );

    return res.status(500).send(
      "Failed to load Consent Manager."
    );
  }

});

// ===============================
// SAVE CONSENT
// ===============================

app.post("/save-consent", async (req, res) => {

  try {

    const {
      nationalId,
      serviceType,
      serviceName,
      department,
      identity,
      income,
      education,
      health,
      caste,
      drivingLicense,
      land,
      businessAndTax,
      employment,
      action
    } = req.body;

    if (
      !nationalId ||
      !serviceType ||
      !serviceName ||
      !department
    ) {

      return res.status(400).send(
        "Required consent details are missing."
      );
    }

    const citizen =
      await UserGovernmentProfile.findOne({
        nationalId: nationalId.trim()
      });

    if (!citizen) {

      return res.status(404).send(
        "Citizen record not found."
      );
    }

    const dataAccess = {

      identity: identity === "true",

      income: income === "true",

      education: education === "true",

      health: health === "true",

      caste: caste === "true",

      drivingLicense:
        drivingLicense === "true",

      land: land === "true",

      businessAndTax:
        businessAndTax === "true",

      employment:
        employment === "true"
    };

    const hasPermission =
      Object.values(dataAccess).some(
        value => value === true
      );

    if (!hasPermission) {

      return res.status(400).send(
        "Please allow at least one data access permission."
      );
    }

    const consent =
      await Consent.create({

        nationalId:
          citizen.nationalId,

        serviceType,

        serviceName,

        dataAccess,

        status: "Active"
      });

    // =========================
    // SAVE ONLY
    // =========================

    if (action === "save") {

      return res.send(`

        <!DOCTYPE html>

        <html lang="en">

        <head>

          <meta charset="UTF-8">

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          >

          <title>Consent Saved</title>

          <link
            rel="stylesheet"
            href="/style.css"
          >

        </head>

        <body class="portal-page">

          <div class="portal-container">

            <div class="data-card">

              <h1>
                Consent Saved Successfully ✅
              </h1>

              <p>
                Consent ID: ${consent._id}
              </p>

              <p>
                Your selected permissions have been saved.
              </p>

              <br>

              <a
                href="/dashboard?nationalId=${encodeURIComponent(citizen.nationalId)}"
                class="back-btn"
              >
                Back to Dashboard
              </a>

            </div>

          </div>

        </body>

        </html>

      `);
    }

    // =========================
    // SUBMIT APPLICATION
    // =========================

    if (action === "submit") {

      const applicationNumber =
        "APP" + Date.now();

      const application =
        await GovernmentApplication.create({

          applicationNumber,

          nationalId:
            citizen.nationalId,

          serviceType,

          serviceName,

          department,

          applicationDate:
            new Date(),

          status:
            "Submitted",

          remarks:
            "Application submitted successfully after consent."
        });

      return res.send(`

        <!DOCTYPE html>

        <html lang="en">

        <head>

          <meta charset="UTF-8">

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          >

          <title>
            Application Submitted
          </title>

          <link
            rel="stylesheet"
            href="/style.css"
          >

        </head>

        <body class="portal-page">

          <div class="portal-container">

            <div class="data-card">

              <h1>
                Application Submitted Successfully ✅
              </h1>

              <h2>
                Application Details
              </h2>

              <p>

                <strong>
                  Application Number:
                </strong>

                ${application.applicationNumber}

              </p>

              <p>

                <strong>
                  Service:
                </strong>

                ${application.serviceName}

              </p>

              <p>

                <strong>
                  Department:
                </strong>

                ${application.department}

              </p>

              <p>

                <strong>
                  Status:
                </strong>

                ${application.status}

              </p>

              <hr>

              <p>

                <strong>
                  Consent ID:
                </strong>

                ${consent._id}

              </p>

              <br>

              <a
                href="/dashboard?nationalId=${encodeURIComponent(citizen.nationalId)}"
                class="back-btn"
              >
                Back to Dashboard
              </a>

              <br><br>

              <a
                href="/portal/applicationStatus?nationalId=${encodeURIComponent(citizen.nationalId)}"
                class="back-btn"
              >
                View Application Status
              </a>

            </div>

          </div>

        </body>

        </html>

      `);
    }

    return res.status(400).send(
      "Invalid action."
    );

  } catch (error) {

    console.error(
      "Consent/Application Error:",
      error
    );

    return res.status(500).send(
      "Failed to process consent."
    );
  }

});

// ===============================
// SIGNUP
// ===============================

app.get("/signup", (req, res) => {
  res.redirect("/register");
});

// ===============================
// REGISTER
// ===============================

app.get("/register", (req, res) => {

  res.render("register", {

    error: null,

    success: null,

    formData: {},

    currentStep: 1

  });

});

app.post("/register", async (req, res) => {

  try {

    const {

      fullName,

      dob,

      gender,

      fatherName,

      address,

      annualIncome,

      incomeCategory,

      sourceOfIncome,

      degree,

      institution,

      passingYear,

      gradeOrPercentage,

      bloodGroup,

      disabilityStatus,

      healthInsuranceId,

      category,

      certificateNumber,

      licenseNumber,

      vehicleTypes,

      expiryDate,

      surveyNumber,

      areaInAcres,

      district,

      state,

      panNumber,

      gstin,

      businessName,

      taxFilingStatus,

      employmentStatus,

      employerName,

      occupation,

      email,

      mobile,

      password

    } = req.body;

    if (

      !fullName ||

      !dob ||

      !gender ||

      !fatherName ||

      !address ||

      !email ||

      !mobile ||

      !password

    ) {

      return res.render(
        "register",
        {

          error:
            "Please fill all required fields.",

          success: null

        }
      );

    }

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanMobile =
      mobile.trim();

    const existingUser =
      await User.findOne({

        $or: [

          {
            email: cleanEmail
          },

          {
            mobile: cleanMobile
          }

        ]

      });

    if (existingUser) {

      return res.render(
        "register",
        {

          error:
            "Email or mobile number already registered.",

          success: null,

          formData:
            req.body,

          currentStep: 10

        }
      );
    }

    const nationalId =
      await generateNationalId();

    // =========================
    // EDUCATION
    // =========================

    const educationData = [];

    if (

      degree ||

      institution ||

      passingYear ||

      gradeOrPercentage

    ) {

      educationData.push({

        degree:
          degree || "",

        institution:
          institution || "",

        passingYear:
          passingYear
            ? Number(passingYear)
            : undefined,

        gradeOrPercentage:
          gradeOrPercentage || ""

      });

    }

    // =========================
    // LAND
    // =========================

    const landData = [];

    if (

      surveyNumber ||

      areaInAcres ||

      district ||

      state

    ) {

      landData.push({

        surveyNumber:
          surveyNumber || "",

        areaInAcres:
          areaInAcres
            ? Number(areaInAcres)
            : undefined,

        district:
          district || "",

        state:
          state || ""

      });

    }

    // =========================
    // GOVERNMENT PROFILE
    // =========================

    const governmentProfile =
      await UserGovernmentProfile.create({

        nationalId,

        identity: {

          fullName:
            fullName.trim(),

          dob:
            new Date(dob),

          gender,

          fatherName:
            fatherName.trim(),

          address:
            address.trim()

        },

        income: {

          annualIncome:
            annualIncome
              ? Number(annualIncome)
              : undefined,

          incomeCategory:
            incomeCategory || "",

          sourceOfIncome:
            sourceOfIncome || ""

        },

        education:
          educationData,

        health: {

          bloodGroup:
            bloodGroup || "",

          disabilityStatus:
            disabilityStatus === "true",

          healthInsuranceId:
            healthInsuranceId || ""

        },

        caste: {

          category:
            category || "",

          certificateNumber:
            certificateNumber || ""

        },

        drivingLicense: {

          licenseNumber:
            licenseNumber || "",

          vehicleTypes:

            vehicleTypes

              ? vehicleTypes

                  .split(",")

                  .map(
                    item =>
                      item.trim()
                  )

                  .filter(Boolean)

              : [],

          expiryDate:

            expiryDate

              ? new Date(expiryDate)

              : undefined

        },

        land:
          landData,

        businessAndTax: {

          panNumber:
            panNumber || "",

          gstin:
            gstin || "",

          businessName:
            businessName || "",

          taxFilingStatus:
            taxFilingStatus || ""

        },

        employment: {

          status:
            employmentStatus || "",

          employerName:
            employerName || "",

          occupation:
            occupation || ""

        }

      });

    // =========================
    // CREATE USER
    // =========================

    await User.create({

      email:
        cleanEmail,

      mobile:
        cleanMobile,

      password,

      nationalId:
        governmentProfile.nationalId

    });

    // =========================
    // SUCCESS
    // =========================

    return res.send(`

      <!DOCTYPE html>

      <html lang="en">

      <head>

        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>
          Account Created
        </title>

        <link
          rel="stylesheet"
          href="/style.css"
        >

        <meta
          http-equiv="refresh"
          content="3;url=/login"
        >

      </head>

      <body class="portal-page">

        <div class="portal-container">

          <div class="data-card">

            <h1>
              Account Created Successfully ✅
            </h1>

            <h2>
              Your National ID
            </h2>

            <p>

              <strong>
                ${nationalId}
              </strong>

            </p>

            <p>
              You will be redirected to Login in 3 seconds...
            </p>

          </div>

        </div>

      </body>

      </html>

    `);

  } catch (error) {

    console.error(
      "Registration Error:",
      error
    );

    return res.render(
      "register",
      {

        error:
          error.message ||
          "Registration failed.",

        success: null

      }
    );
  }

});

// ===============================
// API - CREATE USER
// ===============================

app.post("/api/users", async (req, res) => {

  try {

    const user =
      await UserGovernmentProfile.create(
        req.body
      );

    res.status(201).json({

      message:
        "User profile created successfully",

      data:
        user

    });

  } catch (error) {

    res.status(500).json({

      message:
        "Failed to create user profile",

      error:
        error.message

    });

  }

});

// ===============================
// API - GET USERS
// ===============================

app.get("/api/users", async (req, res) => {

  try {

    const users =
      await UserGovernmentProfile.find();

    res.status(200).json({

      message:
        "Users fetched successfully",

      data:
        users

    });

  } catch (error) {

    res.status(500).json({

      message:
        "Failed to fetch users",

      error:
        error.message

    });

  }

});

// ===============================
// CHANGE LANGUAGE
// ===============================

app.get("/change-lang/:lang", (req, res) => {

  const lang =
    req.params.lang;

  // Only allow supported languages
  if (
    !["en", "hi", "mr"].includes(lang)
  ) {

    return res.status(400).send(
      "Unsupported language."
    );

  }

  // Save selected language
  res.cookie(
    "lang",
    lang
  );

  // Get previous page
  const referer =
    req.get("Referer");

  // Never redirect back to /change-lang
  if (
    referer &&
    !referer.includes("/change-lang/")
  ) {

    return res.redirect(
      referer
    );

  }

  return res.redirect(
    "/dashboard"
  );

});

// ===============================
// START SERVER
// ===============================

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {

  try {

    await connectDB();

    app.listen(
      PORT,
      () => {

        console.log(
          `Server running on http://localhost:${PORT}`
        );

      }
    );

  } catch (error) {

    console.error(
      "Failed to start server:",
      error
    );

  }

};

startServer();