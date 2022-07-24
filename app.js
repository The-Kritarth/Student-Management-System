const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const db = require("./util/db");

const app = express();


app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(3000,function(){
    console.log("Server started on port 3000");
});





// ****************Get Methods***************
app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/login",(req,res)=>{
    res.render("login",{message:""});
});
app.get("/teacher_data",(req,result)=>{
    const sql = "select * from teacher";
    let data = db.query(sql,(err,res)=>{
        if(err) throw err;
        result.render("teacher_data",{tb:res});
    });
});
app.get("/student_data",(req,result)=>{
        result.render("student_data",{tb:""});
});
app.get("/profile_admin",(req,res)=>{
    res.render("admin");
});
// app.get("/add",(req,res)=>{
//     res.render("add");
// });
// app.get("/remove",(req,res)=>{
//     res.render("remove");
// });
// app.get("/profile_teacher",(req,res)=>{
//     res.render("teacher");
// })


//*********** Post Mthods *****************

app.post("/login",function(req,result){
    const {name,password,role}=req.body;
    let sql;
    db.connect((err)=>{
        if(err) throw err;
    
        sql = 'select * from '+role+' where id = "'+name+'" and Password = "'+password+'"';
        
    
        let data =db.query(sql,(err,res,fields)=>{
            if(err) throw err;
            // console.log(res[0].id);
            
            // const sec_sql = 'insert into user (id,password,role) values ("'+name+'", "'+password+'", "'+role+'")';
            // db.query(sec_sql,(err,res)=>{
            //     if(err) throw err;
            //     console.log("inserted");
            // });

            if(res.length>0)
            {
                switch (role)
                {
                    case "admin": result.render("admin");
                                    break;
                    case "teacher": sql ='select sub1,sub2,sub3 from teacher where id="'+name+'"';
                                    let data = db.query(sql,(err,tres)=>{
                                        if(err)
                                            throw err;
                                            // console.log(tres[0].sub1);
                                        result.render("teacher",{row:tres});
                                    });
                                    break;
                    case "student": sql = 'select subject,attendence,ct1,ct2,assignment,end_sem from student where id="'+name+'"'; 
                                    db.query(sql,(err,res)=>{
                                        if(err)
                                            throw err;
                                        result.render("student",{row:res});
                                    });
                }
            }
                //result.render(role,{name:name});
            else
                result.render("login",{message:"Incorrect credentials"});
        });
    });
});

app.post("/student_data",(req,result)=>{
    let sql;
    const {subject} = req.body;
    db.connect((err)=>{
                                if(err) throw err;
                                sql = 'select * from student where subject="'+subject+'"';
                                db.query(sql,(err,res)=>{
                                    if(err) throw err;
                                    result.render("student_data",{tb:res});
                                });
                            });
    // switch(batch){
    //     case "b_2024":
    //                     db.connect((err)=>{
    //                         if(err) throw err;
    //                         sql = 'select * from student where subject="ca710"';
    //                         db.query(sql,(err,res)=>{
    //                             if(err) throw err;
    //                             result.render("student_data",{tb:res});
    //                         });
    //                     });
    //                     break;
    //     case "b_2023":
    //                     db.connect((err)=>{
    //                         if(err) throw err;
    //                         sql = 'select * from student where subject="ca722"';
    //                         db.query(sql,(err,res)=>{
    //                             if(err) throw err;
    //                             result.render("student_data",{tb:res});
    //                         });
    //                     });
    //                     break;
    //     case "b_2022":
    //                     db.connect((err)=>{
    //                         if(err) throw err;
    //                         sql = 'select * from student where subject="ca750"';
    //                         db.query(sql,(err,res)=>{
    //                             if(err) throw err;
    //                             result.render("student_data",{tb:res});
    //                         });
    //                     });
    // }
});

app.post("/teacher_form",(req,result)=>{
    const {subject,operation} = req.body;

    switch (operation){
        case "attendence":
                        db.connect((err)=>{
                            if(err) throw err;
                        
                            const sql = 'select s_no,id from student where subject="'+subject+'"';
                            db.query(sql,(err,res)=>{
                                if(err) throw err;
                                result.render("attendence",{student:res,subject:subject});
                            });
                        });
                        break;
        case "marks":
                    db.connect((err)=>{
                        if(err) throw err;
                    
                        const sql = 'select * from student where subject="'+subject+'"';
                        db.query(sql,(err,res)=>{
                            if(err) throw err;
                            result.render("marks",{student:res,subject:subject});
                        });
                    });
                    break;
        case "stats":
                    db.connect((err)=>{
                        if(err) throw err;
                    
                        const sql = 'select * from student where subject="'+subject+'"';
                        db.query(sql,(err,res)=>{
                            if(err) throw err;
                            result.render("stats",{student:res});
                        });
                    });
    }
});

app.post("/attendence",(req,result)=>{
   let data=req.body;
   let len=Object.keys(data).length;
   let subject = Object.keys(data)[len-1];
   
    for(var i =0 ; i<len-1 ; i++)
    {
        let id = Object.keys(data)[i];
        
        const sql = 'update student set attendence = attendence + 1 where id ="'+id+'" and subject="'+subject+'"';
        db.query(sql,(err,res)=>{
            if(err) throw err;
            result.render("success");
        });
    }
});

app.post("/marks",(req,result)=>{
    
    let {subject,id,ct1,ct2,assignment,end_sem} = req.body;
    //console.log(subject);
    for(var i=0;i<ct1.length;i++){
        const sql = 'update student set ct1='+ct1[i]+' ,ct2='+ct2[i]+' ,assignment='+assignment[i]+' ,end_sem='+end_sem[i]+' where id="'+id[i]+'" and subject="'+subject+'"';
        db.query(sql,(err,res)=>{
            if(err) throw err;
            //console.log(req.body);
            });
    }
    result.render("success");
        
    
});

// app.post("/remove_mem",(req,result)=>{
//     let {id,role}=req.body;
//     switch (role){
//         case "teacher":
//             db.connect((err)=>{
//                 if(err) throw err;
            
//                 const sql = 'delete from teacher where id="'+id+'"';
//                 db.query(sql,(err,res)=>{
//                     if(err) throw err;
//                     result.render("admin_success");
//                 });
//             });
//         case "student":
//             db.connect((err)=>{
//                 if(err) throw err;
            
//                 const sql = 'delete from student where id="'+id+'"';
//                 db.query(sql,(err,res)=>{
//                     if(err) throw err;
//                     result.render("admin_success");
//                 });
//             });
//     }
// });

// app.post("/add_mem",(req,result)=>{
//     let {id,password,role,subject}=req.body;
//     switch (role){
//         case "teacher":
//             db.connect((err)=>{
//                 if(err) throw err;
            
//                 const sql = 'insert into teacher (id,password,subject) values ("'+id+'"'+',"'+password+'"'+',"'+subject+'")';
//                 db.query(sql,(err,res)=>{
//                     if(err) throw err;
//                     result.render("admin_success");
//                 });
//             });
//         case "student":
//             db.connect((err)=>{
//                 if(err) throw err;
            
//                 const sql = 'insert into student (id,password,subject) values ("'+id+'"'+',"'+password+'"'+',"'+subject+'")';
//                 db.query(sql,(err,res)=>{
//                     if(err) throw err;
//                     result.render("admin_success");
//                 });
//             });
//     }
// })

