import { db } from "../dbConnect.js";
import { SQL } from "../PromiseSQL.js";


export const createTableDiners = (req, res, next) => {
  let sql =
    "CREATE TABLE Diners (id INT AUTO_INCREMENT PRIMARY KEY,`lastUpdated` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, name VARCHAR(255), size VARCHAR(255), queue VARCHAR(255), reservations VARCHAR(255), table1 VARCHAR(255), sum VARCHAR(255))";

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send("Table created");
  });
};


export const getAllDiners = (req, res) => {
  db.query("SELECT * FROM Diners", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
};


export const getByIdDiners = (req, res, next) => {
  const { id } = req.params;
  db.query(`SELECT * FROM Diners WHERE id = ?`, [id],  (err, result) => {
    if (err) throw err;
    res.send(result);
  });
};


export const createDiner = (req, res, next) => {

    let sql = 
    db.query('INSERT INTO Diners (name, size, queue, reservations, sum) VALUES (?,?,?,?,?)',[req.body.name,req.body.size, "tobesited", {}, 0 ], (err, result) => {
      if (err) {
        throw err
      }
     else{ console.log("test")
      res.send(dataFromUser)};
    });
};


export const sitByPeriority = async (req, res, next) => {
  let diners = await SQL(`SELECT * FROM Diners WHERE queue ='tobesited' ORDER BY size DESC ,lastUpdated`)
  let tables = await SQL(`SELECT * FROM TablesFood ORDER BY capacity `)

  chunkLoop: for (let diner of diners) {
     for (let table of tables) {

      if (diner.queue != "sit" && table.status == null) {
        if (diner.size <= table.capacity) {
          await SQL(`UPDATE Diners SET queue = 'sit', table1 =  '${table.id}' WHERE id = ${diner.id} `);
          await SQL(`UPDATE TablesFood SET status = '${diner.id}' WHERE id = ${table.id} `);
          break chunkLoop
          
        }
      }
    }
  }
  res.send("success");

}


export const updateDiner = (req, res, next) => {
  const { id } = req.params;

  db.query('UPDATE Diners SET name =?, size = ? WHERE id = ?',[req.body.name, req.body.size, id], (err, data) => {
    if (err) throw err;
    res.send(data);
  });
};


export const deleteDiner = (req, res, next) => {
  const { id } = req.params;

  db.query('UPDATE TablesFood SET status = null  WHERE status = ?', [id],  (err, data) => {
    if (err) throw err;
  });

  db.query('DELETE FROM Diners WHERE id = ?',[id],  (err, result) => {
    if (err) throw err;
    res.send({numberId: id})
  });
};
