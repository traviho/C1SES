var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
var rp = require('request-promise');

var creditCards = [
  {
    name: "Venture Rewards",
    cashBack: 0.02,
    yearFee: 0, //Annual Fee
    interestRate: 0.2349, //Interest Rate
    signBonus: 100, //Signup Bonus
    signUpLen: 3, //Signup promo length
    promoLen: 0, //Promotional Interest Length
    tranFee: 0, //Transfer Fee Percentage
    introLen: 0, //Transfer Introductory Interest Rate
    minSpend: 500
  },
  {
    name: "Quicksilver Rewards",
    cashBack: 0.015,
    yearFee: 0, //Annual Fee
    interestRate: 0.2349, //Interest Rate
    signBonus: 100, //Signup Bonus
    signUpLen: 3, //Signup promo length
    promoLen: 9, //Promotional Interest Length
    tranFee: 0.03, //Transfer Fee Percentage
    introLen: 9, //Transfer Introductory Interest Rate
    minSpend: 500
  },
  {
    name: "VentureOne Rewards",
    cashBack: 0.0125,
    yearFee: 0, //Annual Fee
    interestRate: 0.2249, //Interest Rate
    signBonus: 2000, //Signup Bonus
    signUpLen: 3, //Signup promo length
    promoLen: 12, //Promotional Interest Length
    tranFee: 0, //Transfer Fee Percentage
    introLen: 0, //Transfer Introductory Interest Rate
    minSpend: 1000
  },
  {
    name: "QuicksilverOne Rewards",
    cashBack: 0.015,
    yearFee: 39, //Annual Fee
    interestRate: 0.2499, //Interest Rate
    signBonus: 0, //Signup Bonus
    signUpLen: 0, //Signup promo length
    promoLen: 0, //Promotional Interest Length
    tranFee: 0, //Transfer Fee Percentage
    introLen: 0, //Transfer Introductory Interest Rate
    minSpend: 0
  },
  {
    name: "Platinum",
    cashBack: 0,
    yearFee: 0, //Annual Fee
    interestRate: 0.2499, //Interest Rate
    signBonus: 0, //Signup Bonus
    signUpLen: 0, //Signup promo length
    promoLen: 0, //Promotional Interest Length
    tranFee: 0, //Transfer Fee Percentage
    introLen: 0, //Transfer Introductory Interest Rate
    minSpend: 0
  }
];
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'C1 Credit Card' });
});

router.get('/customizeCard', function(req, res, next){
  
  var contents = fs.readFileSync(path.join(__dirname, "..", "public/data/cpi.json"));

  var jsonContent = JSON.parse(contents);

  var count = Object.keys(jsonContent).length;

  var locations = [];

  for(i = 0; i < count; i++){
    locations.push("\"" + jsonContent[i].name + "\"");
  }

  res.render('customize', { title: 'Customize Card', locations: locations });

});

router.post('/judgeUser', function(req, res, next){
  res.redirect("/judgingYou?email=" + req.body.email
    + "&cashortravel=" + req.body.cashortravel
  );
});

router.post('/judgeCard', function(req, res, next){

  rp("https://odn.data.socrata.com/resource/t64z-nedn.json?variable=index&year=2012&component=All&name=" + req.body.loc).then(function(data){
    
    var cost = (parseInt(JSON.parse(data)[0].value)/100) * 4769;

    res.redirect("/judgingYou?income=" + req.body.income 
      + "&debt=" + req.body.debt
      + "&loc=" + req.body.loc
      + "&cashortravel=" + req.body.cashortravel
      + "&cost=" + cost
    );
  });

});

router.get('/judgingYou', function(req, res, next){
      
    if(req.query.email){
      res.render('judging', 
      { title: 'Judging You', 
        email: req.query.email,
        cashortravel: req.query.cashortravel
      });
    } else {
      res.render('judging', 
      { title: 'Judging You', 
        income: req.query.income, 
        debt: req.query.debt, 
        loc: req.query.loc, 
        cashortravel: req.query.cashortravel,
        cost: req.query.cost
      });
    }
});

router.get('/suggestion', function(req, res, next){
  res.render('suggestion', { title: 'Suggest a Card' });
});

router.get('/cardBuilder', function(req, res, next){
  res.render('cardBuilder', { title: 'Build a Card' });
});

module.exports = router;
