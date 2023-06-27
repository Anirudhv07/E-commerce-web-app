const dbadmin = require('../../schema/dbSchma');

module.exports = {
  //Post Admin Login function
  doAdminLogin: (adminData) => {

    return new Promise(async (resolve, reject) => {
      try {
        const response = {};

        const admin = await dbadmin.admin.findOne({ email: (adminData.email) });

        if (admin) {
          if (adminData.password == admin.password) {
            response.adminName = admin.name;
            response.adminId = admin._id;
            response.adminloggedinstatus = true;
            resolve(response);
          } else {
            reject({ reason: 'Password not match' });
          }
        } else {
          reject({ reason: 'Admin not found' });
        }
      } catch (err) {
        reject(err);
      }
    });
  },
};
