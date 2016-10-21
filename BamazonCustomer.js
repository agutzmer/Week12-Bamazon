//  main.js will contain the logic of your app. Running it in Terminal/Bash will start the game.

var inquirer = require('inquirer');
var mysql = require('mysql');
var connected = false;


var goShopping = function () {

// read in the data table and display the inventory
 conn.query('SELECT * FROM Products',function(err,rows){
    if(err) throw err;

    console.log ("\n\n   ............. Here's what's for sale .............\n\n");
    for (i = 0; i < rows.length; i++) {
      console.log ("   ID:", rows[i].ItemId, "   Product:", rows[i].ProductName, "   Price:", rows[i].Price, "  Quantity in stock:", rows[i].StockQuantity);
     }

 // get the order from the user
	inquirer.prompt([    
	{
		type: "input",
		message: "\n\n    Enter the ID of what you want to buy. ",
		name: "productID"
	},	
	{
		type: "input",
		message: "  Enter how many you want to buy. ",
		name: "quantity"
	}
]
).then(function (user) {  // query the database for that product id

	conn.query('SELECT * FROM Products WHERE ?', {ItemId: parseInt(user.productID)}, function(err,rows){
 		if(err) {
      console.log ("error ", err);
    }

  	// check available stock
  	if (parseInt(rows[0].StockQuantity) < parseInt (user.quantity)) {
  		console.log ("\n\n    Sorry we don't have that many in stock.  Goodbye. \n\n")  // not enough in stock
      return;
  	}
  	else {  // fill the order and update the table
  		console.log ("\n\n    We will ship your ", rows[0].ProductName," immediately!  You will be billed $", parseInt(rows[0].Price) * parseInt(user.quantity), ".  Thank you!\n\n");
      
      var remainingStock = parseInt(rows[0].StockQuantity) - parseInt(user.quantity);     

      conn.query('UPDATE Products SET ? WHERE ?', [{StockQuantity: remainingStock }, {ItemId: user.productID}], function(err,rows){
        if(err) {
          console.log ("error ", err);
        }  
        // do it again
       goShopping();    
      });
     }
    });

    return;
});

});

}


// Start Here
// Open the database

if (!connected) {
  connected = true;
  var conn = mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'armingutzmer',
     	password: 'Wildcats75',
      database: 'Bamazon_db' 
  });

  conn.connect(function(err){
     if(err){
          console.log(err);
          throw err;
      }
     console.log(conn);
  });
} 

goShopping ();
