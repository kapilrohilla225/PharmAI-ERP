exports.systemInfo=(req,res)=>{

res.json({

    success:true,

    app:"Gloss Pharma ERP",

    version:"1.0.0",

    environment:process.env.NODE_ENV,

    uptime:process.uptime(),

    serverTime:new Date(),

    database:"Connected"

    });

};