// const { CustomError } = require("./customError");

// const customErrorHandler = (message: string, statusCode: number, req, res, next) => {
//   if (err instanceof CustomError) {
//     return res.status(err.statusCode).json({ message: err.message });
//   }

//   if (err.message === "jwt malformed") {
//     return res.status(401).json({
//       message: `access denied, invalid token provided`,
//     });
//   }

//   if (err.message === "jwt expired") {
//     return res.status(401).json({
//       message: `access denied, your token expired please sign in again`,
//     });
//   }

//   if (err?.code !== undefined && err?.code === "auth/id-token-expired") {
//     return res.status(401).json({
//       message: `access denied, firebase token expired`,
//     });
//   }

//   return res.status(500).json({ message: "something went wrong" });
// };

// module.exports = customErrorHandler;
