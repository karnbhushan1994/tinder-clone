// utils/validators.js
const allowOnlyFields = (allowedFields = []) => {
    return (req, res, next) => {
      const receivedFields = Object.keys(req.body);
      const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));
  
      if (invalidFields.length > 0) {
        return res.status(400).json({
          message: "Invalid fields in request",
          invalidFields,
        });
      }
  
      next();
    };
  };
  
  module.exports = {
    allowOnlyFields,
  };
  