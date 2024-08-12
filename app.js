const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sql, poolPromise } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Anasayfa
app.get('/', (req, res) => {
    res.render('index');
});

// Filmleri listeleme sayfası
app.get('/list_movies', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Film');
        res.render('list_movies', { movies: result.recordset });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Film ekleme sayfası
app.get('/add_movie', (req, res) => {
    res.render('add_movie');
});
// Kullanıcı SQL sorgusu sayfası
app.get('/execute_sql', (req, res) => {
    res.render('execute_sql', { results: null, error: null });
});

app.post('/execute_sql', async (req, res) => {
    try {
        const pool = await poolPromise;
        const sqlQuery = req.body.sqlQuery;
        await pool.request().query(sqlQuery);
        res.render('execute_sql', { results: 'Sorgu başarıyla çalıştırıldı!', error: null });
    } catch (err) {
        res.render('execute_sql', { results: null, error: `SQL sorgusu çalıştırılırken hata oluştu: ${err.message}` });
    }
});

app.post('/add_movie', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { FilmAdi, CekimTarihi, CekimYeriID } = req.body;
        await pool.request()
            .input('FilmAdi', sql.NVarChar, FilmAdi)
            .input('CekimTarihi', sql.Date, CekimTarihi)
            .input('CekimYeriID', sql.Int, CekimYeriID)
            .query('INSERT INTO Film (FilmAdi, CekimTarihi, CekimYeriID) VALUES (@FilmAdi, @CekimTarihi, @CekimYeriID)');
        res.redirect('/list_movies');
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Yeni kayıt ekleme formu
app.get('/add_entries', (req, res) => {
    res.render('add_entries');
});


// Yeni kayıt ekleme formu
app.get('/add_entries', (req, res) => {
    res.render('add_entries');
});

// Yeni kayıt ekleme işlemi
app.post('/add_entries', async (req, res) => {
    try {
        const {
            cekimYeriID, cekimYeriAdi,
            turID, turAdi,
            yonetmenID, yonetmenAdi, yonetmenSoyadi, yonetmenDogumYeri, yonetmenEgitim,
            yapimciID, yapimciAdi, yapimciSoyadi, yapimciDogumTarihi, yapimciDogumYeri, yapimciEgitim,
            muzikID, muzikAdi, muzikSoyadi, muzikDogumYeri, muzikDogumTarihi, muzikEgitim,
            oyuncuID, oyuncuAdi, oyuncuSoyadi, oyuncuDogumTarihi, oyuncuDogumYeri, oyuncuEgitim
        } = req.body;
        const pool = await poolPromise;
        if (pool) {
            // Çekim Yeri Ekleme
            if (cekimYeriID && cekimYeriAdi) {
                await pool.request()
                    .input('CekimYeriID', sql.Int, cekimYeriID)
                    .input('YerAdi', sql.NVarChar, cekimYeriAdi)
                    .query('INSERT INTO CekimYeri (CekimYeriID, YerAdi) VALUES (@CekimYeriID, @YerAdi)');
            }

            // Tür Ekleme
            if (turID && turAdi) {
                await pool.request()
                    .input('TurID', sql.Int, turID)
                    .input('TurAdi', sql.NVarChar, turAdi)
                    .query('INSERT INTO Tur (TurID, TurAdi) VALUES (@TurID, @TurAdi)');
            }

            // Yönetmen Ekleme
            if (yonetmenID && yonetmenAdi && yonetmenSoyadi) {
                await pool.request()
                    .input('YonetmenID', sql.Int, yonetmenID)
                    .input('Ad', sql.NVarChar, yonetmenAdi)
                    .input('Soyad', sql.NVarChar, yonetmenSoyadi)
                    .input('DogumYeri', sql.NVarChar, yonetmenDogumYeri)
                    .input('Egitim', sql.NVarChar, yonetmenEgitim)
                    .query('INSERT INTO Yonetmen (YonetmenID, Ad, Soyad, DogumYeri, Egitim) VALUES (@YonetmenID, @Ad, @Soyad, @DogumYeri, @Egitim)');
            }

            // Yapımcı Ekleme
            if (yapimciID && yapimciAdi && yapimciSoyadi) {
                await pool.request()
                    .input('YapimciID', sql.Int, yapimciID)
                    .input('Ad', sql.NVarChar, yapimciAdi)
                    .input('Soyad', sql.NVarChar, yapimciSoyadi)
                    .input('DogumTarihi', sql.Date, yapimciDogumTarihi)
                    .input('DogumYeri', sql.NVarChar, yapimciDogumYeri)
                    .input('Egitim', sql.NVarChar, yapimciEgitim)
                    .query('INSERT INTO Yapimci (YapimciID, Ad, Soyad, DogumTarihi, DogumYeri, Egitim) VALUES (@YapimciID, @Ad, @Soyad, @DogumTarihi, @DogumYeri, @Egitim)');
            }

            // Müzisyen Ekleme
            if (muzikID && muzikAdi && muzikSoyadi) {
                await pool.request()
                    .input('MuzisyenID', sql.Int, muzikID)
                    .input('Ad', sql.NVarChar, muzikAdi)
                    .input('Soyad', sql.NVarChar, muzikSoyadi)
                    .input('DogumYeri', sql.NVarChar, muzikDogumYeri)
                    .input('DogumTarihi', sql.Date, muzikDogumTarihi)
                    .input('Egitim', sql.NVarChar, muzikEgitim)
                    .query('INSERT INTO Muzisyen (MuzisyenID, Ad, Soyad, DogumYeri, DogumTarihi, Egitim) VALUES (@MuzisyenID, @Ad, @Soyad, @DogumYeri, @DogumTarihi, @Egitim)');
            }

            // Oyuncu Ekleme
            if (oyuncuID && oyuncuAdi && oyuncuSoyadi) {
                await pool.request()
                    .input('OyuncuID', sql.Int, oyuncuID)
                    .input('Ad', sql.NVarChar, oyuncuAdi)
                    .input('Soyad', sql.NVarChar, oyuncuSoyadi)
                    .input('DogumTarihi', sql.Date, oyuncuDogumTarihi)
                    .input('DogumYeri', sql.NVarChar, oyuncuDogumYeri)
                    .input('Egitim', sql.NVarChar, oyuncuEgitim)
                    .query('INSERT INTO Oyuncu (OyuncuID, Ad, Soyad, DogumTarihi, DogumYeri, Egitim) VALUES (@OyuncuID, @Ad, @Soyad, @DogumTarihi, @DogumYeri, @Egitim)');
            }

            res.send('Kayıtlar başarıyla eklendi!');
        } else {
            res.status(500).send('Database connection failed');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Film güncelleme sayfası
app.get('/update_movie', (req, res) => {
    res.render('update_movie');
});

app.post('/update_movie', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { FilmID, FilmAdi, CekimTarihi, CekimYeriID } = req.body;
        await pool.request()
            .input('FilmID', sql.Int, FilmID)
            .input('FilmAdi', sql.NVarChar, FilmAdi)
            .input('CekimTarihi', sql.Date, CekimTarihi)
            .input('CekimYeriID', sql.Int, CekimYeriID)
            .query('UPDATE Film SET FilmAdi = @FilmAdi, CekimTarihi = @CekimTarihi, CekimYeriID = @CekimYeriID WHERE FilmID = @FilmID');
        res.redirect('/list_movies');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Film silme sayfası
app.get('/delete_movie', (req, res) => {
    res.render('delete_movie');
});

app.post('/delete_movie', async (req, res) => {
    try {
        const pool = await poolPromise;
        const { FilmID } = req.body;
        await pool.request()
            .input('FilmID', sql.Int, FilmID)
            .query('DELETE FROM Film WHERE FilmID = @FilmID');
        res.redirect('/list_movies');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ID ve isimleri listeleme sayfası
app.get('/list_ids_names', async (req, res) => {
    try {
        const pool = await poolPromise;
        const films = await pool.request().query('SELECT FilmID, FilmAdi FROM Film');
        const actors = await pool.request().query('SELECT OyuncuID, Ad, Soyad FROM Oyuncu');
        const musicians = await pool.request().query('SELECT MuzisyenID, Ad, Soyad FROM Muzisyen');
        const producers = await pool.request().query('SELECT YapimciID, Ad, Soyad FROM Yapimci');
        const directors = await pool.request().query('SELECT YonetmenID, Ad, Soyad FROM Yonetmen');
        const shootingPlaces = await pool.request().query('SELECT CekimYeriID, YerAdi FROM CekimYeri');

        res.render('list_ids_names', {
            films: films.recordset,
            actors: actors.recordset,
            musicians: musicians.recordset,
            producers: producers.recordset,
            directors: directors.recordset,
            shootingPlaces: shootingPlaces.recordset
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Kullanıcı sorgu sayfası
app.get('/user_query', (req, res) => {
    res.render('user_query', { results: null, error: null });
});

app.post('/user_query', async (req, res) => {
    try {
        const pool = await poolPromise;
        const userQuery = req.body.query;
        const result = await pool.request().query(userQuery);
        res.render('user_query', { results: result.recordset, error: null });
    } catch (err) {
        res.render('user_query', { results: null, error: err.message });
    }
});

// Gelişmiş sorgular sayfası
app.get('/advanced_queries', (req, res) => {
    res.render('advanced_queries');
});

// Query1: En son eklenen filmleri listeleme
app.get('/query1', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT TOP 10 FilmID, FilmAdi, CekimTarihi FROM Film ORDER BY CekimTarihi DESC');
        res.render('query1', { results: result.recordset });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Query2: Aktörlerin oynadığı filmleri listeleme
app.get('/query2', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT O.OyuncuID, O.Ad, O.Soyad, F.FilmAdi FROM Oyuncu O INNER JOIN FilmOyuncu FO ON O.OyuncuID = FO.OyuncuID INNER JOIN Film F ON FO.FilmID = F.FilmID');
        res.render('query2', { results: result.recordset });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Query3: Her filmin çekim yerini listeleme
app.get('/query3', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT F.FilmID, F.FilmAdi, CY.YerAdi FROM Film F INNER JOIN CekimYeri CY ON F.CekimYeriID = CY.CekimYeriID');
        res.render('query3', { results: result.recordset });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Query4: Müzisyenlerin çalıştığı filmleri listeleme
app.get('/query4', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT M.MuzisyenID, M.Ad, M.Soyad, F.FilmAdi FROM Muzisyen M INNER JOIN FilmMuzisyen FM ON M.MuzisyenID = FM.MuzisyenID INNER JOIN Film F ON FM.FilmID = F.FilmID');
        res.render('query4', { results: result.recordset });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Query5: Yapımcıların yönettiği filmleri listeleme
app.get('/query5', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT Y.YapimciID, Y.Ad, Y.Soyad, F.FilmAdi FROM Yapimci Y INNER JOIN FilmYapimci FY ON Y.YapimciID = FY.YapimciID INNER JOIN Film F ON FY.FilmID = F.FilmID');
        res.render('query5', { results: result.recordset });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Bağlantıyı test etme
app.get('/test_db', async (req, res) => {
    try {
        const pool = await poolPromise;
        res.send('Database connection successful');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
