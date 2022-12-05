// import { RequestHandler } from "express";
// import userData from '../../user-data.json';
// import fs from 'fs/promises';
// import jwt from 'jsonwebtoken';
// import path from "path";
// import _ from "lodash";

// export const login: RequestHandler = async (req, res, next) => {
//   try {
//     // payload check
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({
//         message: 'Invalid request'
//       })
//     }

//     // whether user exists
//     // const user = userData.find(user => user.email === email && user.password === password);
//     if (_.isEmpty(user)) {
//       return res.status(400).json({
//         message: 'Invalid credentials'
//       })
//     }

//     // read the private key
//     const privateKey = await fs.readFile(path.join(__dirname, '..', '..', 'private.key'), 'utf-8');

//     // sign the token asynchronously by using callback
//     jwt.sign(user, privateKey, { algorithm: 'RS256', expiresIn: '12h' }, (err, token) => {
//       if (err) {
//         return res.status(500).json({
//           err: err
//         })
//       }
//       return res.status(200).json({
//         token
//       })
//     });
//   } catch (e) {
//     return res.status(500).json({
//       err: e
//     })
//   }
// }
