if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI IS NOT DEFINED IN ENVVIRONMENT VARIABLES");
}

if(!process.env.GOOGLE_GENAI_API_KEY){
    throw new Error("GOOGLE_GENAI_API_KEY IS NOT DEFINED IN ENVVIRONMENT VARIABLES");
}

if(!process.env.FIREBASE_PROJECT_ID){
    throw new Error("FIREBASE_PROJECT_ID IS NOT DEFINED IN ENVVIRONMENT VARIABLES");
}

if(!process.env.FIREBASE_CLIENT_EMAIL){
    throw new Error("FIREBASE_CLIENT_EMAIL IS NOT DEFINED IN ENVVIRONMENT VARIABLES");
}

if(!process.env.FIREBASE_PRIVATE_KEY){
    throw new Error("FIREBASE_PRIVATE_KEY IS NOT DEFINED IN ENVVIRONMENT VARIABLES");
}

const config={
    MONGO_URI:process.env.MONGO_URI,
    GOOGLE_GENAI_API_KEY:process.env.GOOGLE_GENAI_API_KEY,
    FIREBASE_PROJECT_ID:process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL:process.env.FIREBASE_CLIENT_EMAIL,
    // .env stores newlines as literal "\n" text, so we convert them back to real line breaks
    FIREBASE_PRIVATE_KEY:process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g,"\n")
}

module.exports= config;