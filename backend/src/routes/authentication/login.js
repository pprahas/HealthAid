// import express from 'express';
// import isEmpty from 'is-empty';
// import nodemailer from '../utils/email';
// import query from '../database/queries/authQueries';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import decodeHeader from '../utils/decodeHeader';

// import Apo

// const authRoutes: express.Router = express.Router();

// interface Errors {
//     email?: string;
//     username?: string;
//     password?: string;
// }

// authRoutes.route('/register').post(async (req: express.Request, res: express.Response) => {
//     var errors  = []
//     const { email, username, password } = req.body
    
//     //Ensure all fields required are present
//     if (!email) {
//         errors.email = 'Missing email'
//     }

//     if (!username) {
//         errors.username = 'Missing username'
//     }

//     if (!password) {
//         errors.password = 'Missing password'
//     }

//     if (!isEmpty(errors)) {
//         return res.status(400).json(errors)
//     }

//     if (password.length < 8) {
//         return res.status(400).json('Password too short.')
//     }

//     //Ensure email and username aren't already taken
//     var validAccountQueries = [
//         await query
//             .allUnverifiedUsersByEmail(email)
//             .catch((err) => console.log(err)),
//         await query
//             .allVerifiedUsersByEmail(email)
//             .catch((err) => console.log(err)),
//         await query
//             .allUnverifiedUsersByUsername(username)
//             .catch((err) => console.log(err)),
//         await query
//             .allVerifiedUsersByUsername(username)
//             .catch((err) => console.log(err)),
//     ]

//     var invalidErrors = [
//         'Invalid email: Exists for an unverified account',
//         'Invalid email: Exists for a verified account',
//         'Invalid username: Exists for an unverified account',
//         'Invalid username: Exists for a verified account',
//     ]

//     var errors = []

//     //Go through results of queries to check if username or email is taken
//     for (var i = 0; i < 4; i++) {
//         if (!validAccountQueries[i]) {
//             return res.status(500).json('Error executing MySQL statement')
//         }

//         if (validAccountQueries[i].length != 0) {
//             errors.push(invalidErrors[i])
//         }
//     }

//     //If username or email taken, return error
//     if (errors.length != 0) {
//         var errResult = { errors: errors }
//         return res.status(400).json(errResult)
//     }

//     var confirmationCode = Math.floor(100000 + Math.random() * 900000)

//     nodemailer
//         .sendVerificationEmail(email, confirmationCode)
//         .then((data) => {
//             bcrypt.genSalt(10, async (err, salt) => {
//                 bcrypt.hash(password, salt, async (err, hash) => {
//                     if (err) {
//                         console.log(err)
//                         return res.status(500).json('Error hashing password')
//                     }

//                     var result = await query
//                         .createUnverifiedUser(
//                             username,
//                             email,
//                             hash,
//                             confirmationCode
//                         )
//                         .catch((err) => {
//                             console.log(err)
//                             return res.status(500).json(err)
//                         })

//                     if (!result) {
//                         return res
//                             .status(500)
//                             .json(
//                                 'Error when trying to create unverfied account'
//                             )
//                     }

//                     return res.json('Successfully created an unverified acount')
//                 })
//             })
//         })
//         .catch((err) => {
//             console.log(err)
//             return res
//                 .status(500)
//                 .json(
//                     'Unable to register user due to internal error when sending verification email.'
//                 )
//         })
// });

// // Rest of your routes...

// export default authRoutes;
