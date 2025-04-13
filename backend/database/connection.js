import pg from 'pg'

const pool=new pg.Pool({
    user:"postgres",
    password:"Prajwal1538S@",
    host:"localhost",
    port:5432,
    database:"Project"
})

pool.connect((err)=>{
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Successfully connected to PostgreSQL database');
})

export default pool