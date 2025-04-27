const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');


const playerModel = require("./models/player");
const player = require("./models/player");
const mainMatchContainerModel = require("./models/mainMatchContainer");
const matchFullDetailsModel = require("./models/matchFullDetails");
const appliedPlayerListModel = require("./models/appliedPlayerList");
const selectedPlayerListModel = require("./models/selectedPlayerList");
const rejectedPlayerListModel = require("./models/rejectedPlayerList");
const topupDataModel = require('./models/TopupData');
const { log } = require("console");
const matchFullDetails = require("./models/matchFullDetails");
const mainMatchContainer = require("./models/mainMatchContainer");
const selectedPlayerList = require("./models/selectedPlayerList");
const appliedPlayerList = require("./models/appliedPlayerList");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());



app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);

let isAuthenticated = false;
const authMiddleware = (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
};







//forpersonal
app.get("/ffbetcreatematchmyself", isLoggedIn, async function (req, res) {
  res.render("password1");
});
app.post("/matchcreatepage", isLoggedIn, async function (req, res) {
  let { email, password } = req.body;
  if (email === process.env.EMAILID && password === process.env.PASSWORD) {
    res.render("matchcreatepage");
  } else {
    res.redirect("/ffbetcreatematchmyself");
  }
});

app.post("/creatematchsmyself", isLoggedIn, async function (req, res) {
  const mainMatchContainer = await mainMatchContainerModel.findOne();

  let {
    matchType,
    entryAmount,
    firstPrice,
    secondPrice,
    thirdPrice,
    fourthandfifthPrice,
    sixthtoteenthPrice,
    totalParticipantPlayerNumber,
    matchStartingTime,
    roomId,
    roomPassword,
  } = req.body;

  let matchFullDetails = await matchFullDetailsModel.create({
    matchType,
    entryAmount,
    firstPrice,
    secondPrice,
    thirdPrice,
    fourthandfifthPrice,
    sixthtoteenthPrice,
    totalParticipantPlayerNumber,
    matchStartingTime,
    roomId,
    roomPassword,
  });
  await matchFullDetails.save();
  mainMatchContainer.matchFullDetails.push(matchFullDetails._id);
  await mainMatchContainer.save();
  res.redirect("/ffbetcreatematchmyself");
});

app.get("/playerselectedpage", isLoggedIn, async function (req, res) {
  res.render("password");
});
app.post("/playerselectedpage", isLoggedIn, async function (req, res) {
  let { email, password } = req.body;
  if (email === process.env.EMAILID && password === process.env.PASSWORD) {
    let appliedPlayerList = await appliedPlayerListModel.find();
    res.render("playerselectedpage", { appliedPlayerList });
    
  } else {
    res.redirect("/playerselectedpage");
  }
});

app.post("/playerSelect", isLoggedIn, async function (req, res) {
  let {
    MDmatchId,
    appliedplayerMDmatchid,
    playerName,
    playerId,
    matchType,
    paymentMethod,
    matchStartingTime,
    entryAmount,
    TransactionId,
  } = req.body;

  const matchFullDetails = await matchFullDetailsModel.findById({
    _id: MDmatchId,
  });

  let selectedPlayerList = await selectedPlayerListModel.create({
    MDmatchId,
    appliedplayerMDmatchid,
    playerName,
    playerId,
    matchType,
    paymentMethod,
    matchStartingTime,
    entryAmount,
    TransactionId,
  });
  let appliedPlayerList = await appliedPlayerListModel.updateOne(
    { _id: appliedplayerMDmatchid },
    { $set: { selectbtn: "Selected" } }
  );

  await selectedPlayerList.save();
  matchFullDetails.selectedPlayerList.push(selectedPlayerList._id);
  await matchFullDetails.save();
  return res.redirect("playerselectedpage");
});
app.post("/playerReject", async function (req, res) {
  let {
    MDmatchId,
    appliedplayerMDmatchid,
    playerName,
    playerId,
    matchType,
    paymentMethod,
    matchStartingTime,
    entryAmount,
    TransactionId,
  } = req.body;

  const matchFullDetails = await matchFullDetailsModel.findById({
    _id: MDmatchId,
  });

  let rejectedPlayerList = await rejectedPlayerListModel.create({
    MDmatchId,
    appliedplayerMDmatchid,
    playerName,
    playerId,
    matchType,
    paymentMethod,
    matchStartingTime,
    entryAmount,
    TransactionId,
  });
  await appliedPlayerListModel.updateOne(
    { _id: appliedplayerMDmatchid },
    { $set: { rejectbtn: "Rejected" } }
  );
  await appliedPlayerListModel.findOneAndDelete({
    _id: appliedplayerMDmatchid,
  });
  await matchFullDetailsModel.updateOne(
    { _id: MDmatchId },
    { $pull: { appliedPlayerList: appliedplayerMDmatchid } }
  );

  await rejectedPlayerList.save();
  matchFullDetails.rejectedPlayerList.push(rejectedPlayerList._id);
  await matchFullDetails.save();
  return res.redirect("playerselectedpage");
});

app.get("/", function (req, res) {
  res.redirect("/home");
});



app.get("/home", isLoggedIn, async function (req, res) {
  let mainMatchContainer = await mainMatchContainerModel.find().populate({
    path: "matchFullDetails",
    populate: {
      path: "selectedPlayerList",
      model: "selectedPlayerList",
    },
  });
  const matchAppliedorcanceled = req.session.matchAppliedorcanceled;
  req.session.matchAppliedorcanceled = null;

  const player = await playerModel.findOne({ FFID: req.player.FFID });
  if(! player){
    res.redirect('/signup');
  }
  else{
    let playerFFID = player.FFID;

    const filteredMatches = mainMatchContainer.map((container) => {
      container.matchFullDetails = container.matchFullDetails.map((match) => {
        match.showRoomDetails = match.selectedPlayerList.some(
          (player) => player.playerId === String(playerFFID)
        );
        return match;
      });
      return container;
    });
  
    res.render("home", {
      mainMatchContainer: filteredMatches,
      player,
      matchAppliedorcanceled: matchAppliedorcanceled,
    });
  }

});

app.get("/termsandconditions", function (req, res) {
  res.render("termsandcondition");
});

// SIGNUP PAGE PACKEND

app.get("/signup", function (req, res) {
  res.render("signup", { mobileError: null, FormData: {} });
});

app.post("/signup", async function (req, res) {
  let { MobileNo, FFID, FFNAME, password } = req.body;
  let unHasedPassword = password;

  let player = await playerModel.findOne({ FFID });

  if (MobileNo.length < 10) {
    return res.render("signup", {
      mobileError: "Invalid Mobile Number",
      FormData: req.body,
    });
  }
  if (FFID.length < 10) {
    return res.render("signup", {
      mobileError: "Invalid FF Id",
      FormData: req.body,
    });
  }
  if (player) {
    return res.render("signup", {
      mobileError: "Your FF Id  is already registered",
      FormData: req.body,
    });
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      let player = await playerModel.create({
        MobileNo,
        FFID,
        FFNAME,
        password :hash,
        unHasedPassword,
        solomatchwiningcounts: 0,
        duomatchwiningcounts: 0,
        squadmatchwiningcounts: 0,
        solomatchwiningdiamonds: 0,
        duomatchwiningdiamonds: 0,
        squadmatchwiningdiamonds: 0,
        totaldiamonds: 0,

      });
      let token = jwt.sign({ FFID: FFID, playerid: player._id }, process.env.JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        sameSite: "none",
      });
      res.redirect("/home");
    });
  });
});

app.get("/login", async function (req, res) {
  res.render("login", { mobileError: null, FormData: {} });
});

app.post("/login", async function (req, res) {
  let { FFID, password } = req.body;

  let player = await playerModel.findOne({ FFID });
  if (!player) {
    return res.render("login", {
      mobileError: "FF Id was Wrong",
      FormData: req.body,
    });
  }
  bcrypt.compare(password, player.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ FFID: FFID, playerId: player._id }, process.env.JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        sameSite: "none",
      });
      isAuthenticated = true;
      res.redirect("home");
    } else {
      return res.render("login", {
        mobileError: "Password is wrong",
        FormData: req.body,
      });
    }
  });
});

app.get("/logout", async function (req, res) {
  res.cookie("token", "");
  isAuthenticated = false;
  res.redirect("login");
});

app.get("/playerdetails", isLoggedIn, async function (req, res) {
  const player = await playerModel.findOne({ FFID: req.player.FFID });

  res.render("playerdetailspage", { player });
});


app.post("/paymentBtn", isLoggedIn, async function (req, res) {
  const player = await playerModel.findOne({ FFID: req.player.FFID });
  const playerId = player.FFID;

  const { matchType, MDmatchId, matchStartingTime, entryAmount } = req.body;

  
  
  
  const encodedTime = encodeURIComponent(matchStartingTime);
  const hashedRoute = crypto
    .createHash("sha256")
    .update(`${playerId}-${MDmatchId}-${matchType}-${process.env.SECRET_KEY}`)
    .digest("hex");

  res.redirect(
    `/payment/${playerId}/${matchType}/${MDmatchId}/${entryAmount}/${encodedTime}/${hashedRoute}`
  );
});

app.get('/payment/:playerId/:matchType/:MDmatchId/:entryAmount/:matchStartingTime/:hashedRoute', isLoggedIn, async function (req, res) {


  const { playerId, matchType, MDmatchId, entryAmount, matchStartingTime, hashedRoute } = req.params;


  const matchFullDetails = await matchFullDetailsModel.findById({ _id: MDmatchId });


  const expectedHash = crypto
    .createHash("sha256")
    .update(`${playerId}-${MDmatchId}-${matchType}-${process.env.SECRET_KEY}`)
    .digest("hex");

  if (expectedHash !== hashedRoute) {
    return res.status(403).send("Invalid payment route.");
  }

  const player = await playerModel.findOne({ FFID: req.player.FFID });

  res.render('payment', {
    matchType,
    MDmatchId,
    matchStartingTime: decodeURIComponent(matchStartingTime),
    entryAmount,
    player,
    matchFullDetails

  });
});




app.post("/paymentsend", isLoggedIn, async function (req, res) {
  let {
    MDmatchId,
    playerName,
    playerId,
    matchType,
    entryAmount,
    paymentMethod,
    matchStartingTime,
    TransactionId,
  } = req.body;

  const matchFullDetails = await matchFullDetailsModel
    .findOne({ _id: MDmatchId })
    .populate("appliedPlayerList");

    if (matchFullDetails) {
      const playerIds = matchFullDetails.appliedPlayerList.map(
        (player) => player.playerId
      );
      if (playerIds.includes(playerId)) {
        req.session.matchAppliedorcanceled = `${playerId} This PlayerId Was Already Applied This Match`;
        return res.redirect("home");
      }
      if(entryAmount === '₹FREE'){

        let appliedPlayerList = await appliedPlayerListModel.create({
          MDmatchId,
          playerName,
          playerId,
          matchType,
          entryAmount,
          matchStartingTime,
          selectbtn: "Selected",
          rejectbtn: "Reject",
        })
        const matchFullDetails = await matchFullDetailsModel.findById({
          _id: MDmatchId,
        });
        await appliedPlayerList.save();
        matchFullDetails.appliedPlayerList.push(appliedPlayerList._id);
        await matchFullDetails.save();
              
 
      
        let selectedPlayerList = await selectedPlayerListModel.create({
          MDmatchId,
          playerName,
          playerId,
          matchType,
          matchStartingTime,
          entryAmount,
        });
    
      
        await selectedPlayerList.save();
        matchFullDetails.selectedPlayerList.push(selectedPlayerList._id);
        await matchFullDetails.save();
        req.session.matchAppliedorcanceled =
        "You Are Joined The Match🎉";
        return res.redirect("home");
      }else {
        let appliedPlayerList = await appliedPlayerListModel.create({
          MDmatchId,
          playerName,
          playerId,
          matchType,
          matchStartingTime,
          entryAmount,
          paymentMethod,
          TransactionId,
          selectbtn: "Select",
          rejectbtn: "Reject",
        });
        await appliedPlayerList.save();
        matchFullDetails.appliedPlayerList.push(appliedPlayerList._id);
        await matchFullDetails.save();
        req.session.matchAppliedorcanceled =
          "Applied Sucessfully.. Wait for few Minutes.. you will be add that match";
        return res.redirect("home");
      }
    }

  const fullTransactionId = await appliedPlayerListModel.findOne({
    TransactionId,
  });
  const fullPlayerId = await appliedPlayerListModel.findOne({ playerId });
  if (fullTransactionId) {
    req.session.matchAppliedorcanceled = `${TransactionId} This TransactionId Was Already Used. Please Enter Valid TransactionId`;
    return res.redirect("home");
  }


});

app.get(
  "/playerdetails/:MDmatchId/:hashedRoute",
  isLoggedIn,
  async function (req, res) {
    let { MDmatchId } = req.params;

    const matchFullDetails = await matchFullDetailsModel
      .findById({ _id: MDmatchId })
      .populate("selectedPlayerList");
    let player = await playerModel.findOne({ FFID: req.player.FFID });
    res.render("playerDetails", {
      matchFullDetails: matchFullDetails.selectedPlayerList,
    });
  }
);

app.post("/playerdetails", isLoggedIn, async function (req, res) {
  let { MDmatchId } = req.body;

  const hashedRoute = crypto
    .createHash("sha256")
    .update(MDmatchId)
    .digest("hex");
  res.redirect(`/playerDetails/${MDmatchId}/${hashedRoute}`);
});

app.get('/diamond', isLoggedIn , async function (req,res) {

  let player = await playerModel.findOne({ FFID: req.player.FFID });
  if(! player){
    res.redirect('/signup')
  }else{
    res.render('diamond', {player})
  }

})

app.post('/redeem', isLoggedIn , async function(req,res){
  let player = await playerModel.findOne({ FFID: req.player.FFID });
  const playerFFID = player.FFID;
  let {redeemdiamondValue} = req.body;
  if(player.totaldiamonds < redeemdiamondValue){
    req.session.matchAppliedorcanceled =
    "You don't have enough diamonds.";
    res.redirect('/home');
  }else{
     await topupDataModel.create({
      playerFFID,
      redeemdiamondValue,
      TopupOrNot: "NO",
    })
    let newDiamondValue = player.totaldiamonds-redeemdiamondValue;
    
    await playerModel.findOneAndUpdate(
      { FFID: req.player.FFID },
      { totaldiamonds: newDiamondValue },
      { new: true }
  );

    req.session.matchAppliedorcanceled =
    `Redeem successful.Within 24 hours, ${redeemdiamondValue} diamonds will be topped up to your Free Fire ID ${playerFFID}.`;
    res.redirect('/home');
  }
  
})

function isLoggedIn(req, res, next) {

  const token = req.cookies?.token;

  // Check if token is missing or empty
  if (!token || token.length === 0) {
    return res.redirect("/login");
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.player = data;
    next(); // Call next only after successful verification
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.redirect("/login"); // Redirect if token is invalid
  }
}

// app.listen(process.env.PORT || 3000, '0.0.0.0', function () {
//   console.log("server running well ✔");
// });

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running well ✔ ${process.env.PORT}`);
});
