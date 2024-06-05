var userService = require('./userService');
var getDataConntrollerfn = async (req, res) =>
{
    var stock = await userService.getDataFromDBService();
    res.send({ "status": true, "data": stock });
}
var createUserControllerFn = async (req, res) => 
{
    var status = await userService.createUserDBService(req.body);
    if (status) {
        res.send({ "status": true, "message": "Request created successfully" });
    } else {
        res.send({ "status": false, "message": "Error creating request" });
    }
}
var updateUserController = async (req, res) => 
{
    console.log(req.params.id);
    console.log(req.body);
     
    var result = await userService.updateUserDBService(req.params.id,req.body);
     if (result) {
        res.send({ "status": true, "message": "Stock Updated"} );
     } else {
         res.send({ "status": false, "message": "Stock Update Fail" });
     }
}
var deleteUserController = async (req, res) => 
{
     console.log(req.params.id);
     var result = await userService.removeUserDBService(req.params.id);
     if (result) {
        res.send({ "status": true, "message": "Stock Deleted"} );
     } else {
         res.send({ "status": false, "message": "Stock Deleted Fail" });
     }
}
module.exports = { getDataConntrollerfn, createUserControllerFn,updateUserController,deleteUserController };