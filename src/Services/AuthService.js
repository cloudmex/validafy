import { use } from "chai";

export default {
    login : user =>{
        console.log(user);
        return fetch('/user/login',{
            method : "post",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => {
            if(res.status !== 401)
                return res.json().then(data => data);
            else
                return { isAuthenticated : false, user : {username : "",role : ""}};
        }).catch((err) => {
            console.log(err)
            })
    },
    register : user =>{
        console.log(user);
        return fetch('/user/register',{
            method : "post",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => res.json())
          .then(data => data)
          .catch((err) => {
            console.log(err)
            });
    },
    Adminregister : user =>{
        console.log(user);
        return fetch('/user/registerAdmins',{
            method : "post",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => res.json())
          .then(data => data)
          .catch((err) => {
            console.log(err)
            });
    },
    
    getStudens : ()=>{
        return fetch('/user/get-student')
                .then(response=>{
                    if(response.status !== 401){
                        return response.json(response.data)
                    }
                    else
                        return {message : {msgBody : "UnAuthorized",msgError : true}};
                });
    },
    
    getStudent :id_Student =>{
        return fetch('/user/edit-student/' + id_Student)
                .then(response=>{
                    if(response.status !== 401){
                        return response.json(response.data)
                    }
                    else
                        return {message : {msgBody : "UnAuthorized",msgError : true}};
                });
    },
    deleteStudent: id_Student=>{
        return fetch('/user/delete-student/'+id_Student , {
            method: 'delete'
          })
          .then(response => response.json());
    },
    updateStudent : Student=>{
        fetch('/user/update-student/'+Student.id, Student.Object)
      .then((res) => {
        console.log(res.data)
        console.log('Student successfully updated')
      }).catch((error) => {
        console.log(error)
      })
    },
    updateDD : user =>{
        console.log(user);
        return fetch('/user/update-student/'+user.id,{
            method : "put",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => res.json())
          .then(data => data)
          .catch((err) => {
            console.log(err)
            });
    },
    regnewcertbyid : user =>{
        console.log(user);
        return fetch('/user/cert/'+user.id,{
            method : "post",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => res.json())
          .then(data => data)
          .catch((err) => {
            console.log(err)
            });
    },
    postAdmin  : admin=>{
        return fetch('/user/admin',{
            method : "post",
            body : JSON.stringify(admin),
            headers:{
                'Content-Type' : 'application/json'
            }
        }).then(response=>{
            if(response.status !== 401){
                return response.json().then(data => data);
            }
            else
                return {message : {msgBody : "UnAuthorized"},msgError : true};
        });
    },
    Certregister : user =>{
        console.log(user);
        return fetch('/user/certregister',{
            method : "post",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => res.json())
          .then(data => data)
          .catch((err) => {
            console.log(err)
            });
    },
    logout : ()=>{
        return fetch('/user/logout')
                .then(res => res.json())
                .then(data => data);
    },
    
    solCert : cert =>{
        return fetch('/user/solCert',{
            method : "post",
            body : JSON.stringify(cert),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => {
            if(res.status !== 401)
                return res.json().then(data => data);
            else
                return { isAuthenticated : false, user : {username : "",role : ""}};
        }).catch((err) => {
            console.log(err)
        })
    },
    getSolCert : ()=>{
        return fetch('/user/get-solCert')
            .then(response=>{
                if(response.status !== 401)
                    return response.json(response.data)
                else
                    return {message : {msgBody : "UnAuthorized", msgError : true}};
            });
    }
}