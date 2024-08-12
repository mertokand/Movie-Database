const sql = require('mssql');

const config = {
    user: 'testuser', // Oluşturduğunuz yeni kullanıcı adı
    password: '123', // Oluşturduğunuz yeni kullanıcının şifresi
    server: 'DESKTOP-14U5AS5',
    database: 'FilmVeriTabani', // Veritabanı adınızı yazın
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.log('Database Connection Failed! Bad Config: ', err);
        return null;
    });

module.exports = {
    sql, poolPromise
};
