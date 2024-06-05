var userModel = require('./userModel');

module.exports.getDataFromDBService = () => {
  return new Promise(function checkURL(resolve, reject) {
    userModel.find({}, function returnData(error, result) {
      if (error) {
        reject(error); // Pass the error to the reject function
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.createUserDBService = (userDetails) => {
  return new Promise(function myFn(resolve, reject) {
    var userModelData = new userModel();
    userModelData._id=userDetails._id;
    userModelData.medId=userDetails.medId;
    userModelData.quantity = userDetails.quantity;
    userModelData.save(function resultHandle(error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.updateUserDBService = (id, userDetails) => {
  return new Promise(function myFn(resolve, reject) {
    userModel.findByIdAndUpdate(id, userDetails, function returnData(error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.removeUserDBService = (id) => {
  return new Promise(function myFn(resolve, reject) {
    userModel.findByIdAndDelete(id, function returnData(error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};