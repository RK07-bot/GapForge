//in non destructured way w
//const express=require("express")
//const authRouter=XPathExpression.Router;


//destructured way
const {Router}=require("express");
const authController=require("../controllers/auth.controller.js")
const authMiddleware=require("../middlewares/auth.middleware.js")
const authRouter=Router()



/**
 * @route GET /api.auth/get-me
 * @description get the current loggedin user details
 * @access Private
 */
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)






module.exports=authRouter