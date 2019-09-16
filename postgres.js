const {Pool} = require('pg');

    //Starting up cleint with config
    const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: true
    });
    //connecting client
    //await pool.connect()
     //   .then( () => console.log('connected to Postgresql...'))
      //  .catch( (e)=> console.error('Could not connect to Postgresql...', e));
    
  



module.exports.registerUser =async (_name,_email,_pswd1)=> {
    
    //Insering registration
    const text = `INSERT INTO members(name, email, password) VALUES('${_name}','${_email}','${_pswd1}') RETURNING *`;
    try {
        const cleint= await pool.connect();
        const result = await cleint.query(text);
        cleint.release();
        return result;
    } catch (error) {
        console.log('DB error registerUser:',error.message)
    } 
}
    
//getting a user
module.exports.getUser =async (email) => {
    const text = `SELECT * FROM members WHERE email='${email}'`;
    try {
        const cleint=await pool.connect();
        const result= await cleint.query(text);
        cleint.release();
        return result;    
    } catch (error) {
        console.log('Db error getUser: ',error)
    }
}

