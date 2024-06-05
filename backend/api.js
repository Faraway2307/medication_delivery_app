const client = require('./connection.js')
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const bodyParser = require("body-parser");
const cors = require('cors')

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};
const JWT_SECRET = generateSecretKey();

app.use(cors()) // Use this after the variable declaration
app.use(bodyParser.json());
app.use(express.json());

app.listen(3300, () => {
  console.log("Server is now listening at port 3000");
})

// Display of medications based on medication table [ inventory.component ]
app.get('/inventory', (req, res) => {
  var displaymed = "SELECT * FROM medication ORDER BY medcode ASC";
  var displaycapacity = "SELECT COUNT(*) FROM medication";
  var displaypatients = "SELECT COUNT(*) FROM patient";
  var displayshortage = "SELECT COUNT(*) FROM medication WHERE stock < 10;"
  client.query(displaymed, (err, result1) => {
    if (err) {
      return res.status(500).send('Error retrieving medication data');
    }

    client.query(displaycapacity, (err, result2) => {
      if (err) {
        return res.status(500).send('Error retrieving medication capacity');
      }

      client.query(displaypatients, (err, result3) => {
        if (err) {
          return res.status(500).send('Error retrieving patients capacity');
        }
        client.query(displayshortage, (err, result4) => {
          if (err) {
            return res.status(500).send('Error retrieving patients capacity');
          }
            var response = {
              displaymed: result1.rows,
              displaycapacity: result2.rows[0].count,
              displaypatients: result3.rows[0].count,
              displayshortage: result4.rows[0].count,
            };
            res.status(200).send(response);
          });
        });
      });
    });
  client.end;
});

// Display of quantity, recent order and medicine-list component based [ user-home.component ]
app.put('/userpage', (req, res) => {
  const {querytext,pid} = req.body;
  var displaypendingnum = "SELECT COUNT(*) FROM medicationorder WHERE status='Pending' AND pid=$1";
  var displayrecentorder = `SELECT mo.meddesc, mo.encounterid, m.medcode,m.medname,m.price,m.stock,mo.pid,mo.doctorid FROM medicationorder as mo JOIN 
  medication as m ON m.medcode = mo.medcode WHERE mo.status='Completed' 
  AND mo.pid=${querytext}`;

  client.query(displayrecentorder, async (err, result1)=> {
    console.log(displayrecentorder)
    if (err) {
      return res.status(500).send('Error retrieving medication data');
    }
    console.log(pid)
    if(pid){

    client.query(displaypendingnum, [pid], async (err, result2) => {
      if (err) {
        return res.status(500).send('Error retrieving medication capacity');
      }
          var response = {
            displayrecentorder: result1.rows,
            displaypendingnum: result2.rows[0].count,
          };
          res.status(200).send(response);
        });
        client.end;
      }
      else{
      response = result1;
      res.status(200).send(response);
      }
      });
      
  client.end;
});

// Display all encounters for particular admin on their patient they're in charge of [ encounter.component ]
app.put('/viewencounter', (req, res) => {
  const { did,pid } = req.body;
  var displayencounter = `SELECT
  mo.orderID,
  mo.pid,
  mo.startDate,
  mo.encounterID,
  mo.medCode,
  mo.medDesc,
  mo.status,
  mo.reason,
  mo.doctorID,
  e.encounterid,
  e.encounterdate,
  e.pid,
  e.encounterdesc,
  e.doctorid
FROM
  medicationorder as mo
  JOIN encounter as  e ON mo.encounterID = e.encounterID
  WHERE e.doctorid=$1 AND e.pid=$2
`;
  console.log(pid)
  client.query(displayencounter, [did,pid] , async (err, result) => {
    if (err) {
      return res.status(500).send('Error retrieving encounters');
    }
    var response = result;
    console.log(response.rows)
    res.status(200).send(response.rows);
    });
  client.end;
});

// Display of assigned patient to admin in [ admin-home-page.component ]
app.get('/filterpid', (req, res) => {
  var displaypatient = `SELECT DISTINCT p.full_name,p.pid FROM patient as p;`;
  client.query(displaypatient, async (err, result) => {
    if (err) {
      return res.status(500).send('Error retrieving information data');
    }
    var response = result;
    res.status(200).send(response);
    });
  client.end;

});

// Display of all requested medication order for admin to see [ view-order-request.component ] and show numbers in admin-home page [ admin-home-page.component ]
app.put('/requestallorder', (req, res) => {
  const {did} = req.body;
  var displaymed = `SELECT mo.orderid,p.full_name,mo.meddesc,mo.startdate,mo.status 
  FROM medicationorder AS mo JOIN patient AS p ON p.pid=mo.pid JOIN admin 
  AS a ON a.did=mo.doctorid WHERE a.did = $1 ORDER BY mo.orderid DESC;`;
  var displaypending =  `SELECT COUNT(*)
  FROM medicationorder AS mo JOIN patient AS p ON p.pid=mo.pid JOIN admin 
  AS a ON a.did=mo.doctorid WHERE status = 'Pending' AND a.did = $1;`;
  var displaycomplete =  `SELECT COUNT(*)
  FROM medicationorder AS mo JOIN patient AS p ON p.pid=mo.pid JOIN admin 
  AS a ON a.did=mo.doctorid WHERE status = 'Completed' AND a.did = $1;`;
  client.query(displaymed, [did] , async (err, result) => {
    if (err) {
      return res.status(500).send('Error retrieving medication data');
    }
    client.query(displaypending, [did] , async (err, result2) => {
      if (err) {
        return res.status(500).send('Error retrieving medication data');
      }
        client.query(displaycomplete, [did], (err, result3) => {
          if (err) {
            return res.status(500).send('Error retrieving completed requests');
          }
            var response = {
              displaymed: result.rows,
              displaypending: result2.rows[0].count,
              displaycomplete: result3.rows[0].count,
            };
            res.status(200).send(response);
          });
      });
    });
  client.end;

});

// Get password of user for user-profile.component
app.put('/getpw', (req, res) => {
  const { userid } = req.body;
  var getpw = `SELECT password FROM users WHERE userid = $1`;
  client.query(getpw, [userid],async (err, result) => {
    if (err) {
      return res.status(500).send('Error retrieving medication data');
    }
    var response = result;
    res.status(200).send(response);
    });
  client.end;

});

// Get password of user for user-profile.component
app.put('/getdid', (req, res) => {
  const { pid } = req.body;
  var getdid = `SELECT DISTINCT doctorID FROM encounter WHERE pid = $1`;
  client.query(getdid, [pid],async (err, result) => {
    if (err) {
      return res.status(500).send('Error retrieving doctorID data');
    }
    var response = result;
    res.status(200).send(response);
    });
  client.end;

});

// Get eid of user for recent_order.component
app.put('/geteid', (req, res) => {
  const { medcode,pid } = req.body;
  var geteid = `SELECT e.encounterid FROM encounter AS e 
  JOIN patient AS p ON p.pid=e.pid 
  JOIN medicationorder as mo ON mo.encounterid = e.encounterid 
  WHERE mo.medcode = $1 AND p.pid = $2;`;
  client.query(geteid, [medcode,pid], (err, result) => {
    if (err) {
      return res.status(500).send('Error retrieving encounterID data');
    }
    var response = result;
    res.status(200).send(response);
    });
  client.end;

});

// Display of all approved medication order for admin to see [ make-payment-popup component ] 
app.put('/approvedorder', (req, res) => {
  const { pid } = req.body;
  var displaymed = `SELECT mo.orderid,m.medname,mo.startdate,mo.status,m.price,mo.medcode,m.stock
  FROM medicationorder as mo JOIN medication as m ON mo.medcode=m.medcode
   WHERE status='Approved' AND pid=$1`;
  client.query(displaymed, [pid], async (err, result) => {
    if (err) {
      return res.status(500).send('Error retrieving medication data');
    }
    var response = result;
    res.status(200).send(response);
    });
  client.end;

});


// Display of individual patient requested medication order for users to see [ view-patient-order-request.component ]
app.put('/requestpatientorder', (req, res) => {
  const {pid} = req.body;
  var displaymed = "SELECT * FROM medicationorder as mo JOIN medication as m ON mo.medcode = m.medcode WHERE mo.pid=$1 ORDER BY status DESC";
  console.log(pid);
  client.query(displaymed, [pid], async (err, result) => {
    if (err) {
      return res.status(500).send('Error retrieving medication data');
    }
    var response = result;
    res.status(200).send(response);
    });
  client.end;
});

// 
app.put('/getCurrentUser', (req, res) => {
  const { userid } = req.body;
  const getCurrentUserQuery = 'SELECT * FROM users WHERE userid = $1';

  client.query(getCurrentUserQuery, [userid], (err, result) => {
    if (err) {
      console.error('Error retrieving user data:', err);
      return res.status(500).send('Error retrieving user data');
    }

    const response = result.rows[0]; // Get the first row from the result

    res.status(200).json(response);
  });
});

// Used in [user-profile component]
app.put('/getUserInfo', (req, res) => {
  const { userid, role } = req.body;
  if(role == 'Admin'){
  const getCurrentUserQuery = 'SELECT full_name,contact FROM admin WHERE user_id = $1';
  client.query(getCurrentUserQuery, [userid], (err, result) => {
    if (err) {
      console.error('Error retrieving user data:', err);
      return res.status(500).send('Error retrieving user data');
    }

    const response = result.rows[0]; // Get the first row from the result
    res.status(200).json(response);
  });
  }
  else{
    const getCurrentUserQuery = 'SELECT full_name,contact,address FROM patient WHERE user_id = $1';

    client.query(getCurrentUserQuery, [userid], (err, result) => {
      if (err) {
        console.error('Error retrieving user data:', err);
        return res.status(500).send('Error retrieving user data');
      }
  
      const response = result.rows[0]; // Get the first row from the result
      res.status(200).json(response);
    });
  }
});


// Login of account based on users table [ user-login-popup ]
app.post('/account/login', async (req, res) => {
  const { nric, password } = req.body;

  try {
    // Retrieve the user from the database based on the provided NRIC
    const getUserQuery = 'SELECT * FROM users WHERE nric = $1';
    const result = await client.query(getUserQuery, [nric]);

    // Check if a user with the provided NRIC exists
    if (result.rows.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    const firstuser = result.rows[0];
    let user;

    if (firstuser.role === 'Patient') {
      // Retrieve the patient based on the user_id
      const getpid = 'SELECT * FROM patient WHERE user_id = $1';
      const result_pid = await client.query(getpid, [firstuser.userid]);
      user = result_pid.rows[0];
    } else if (firstuser.role === 'Admin') {
      // Retrieve the admin based on the user_id
      const getadmin = 'SELECT * FROM admin WHERE user_id = $1';
      const result_pid = await client.query(getadmin, [firstuser.userid]);
      user = result_pid.rows[0];
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, firstuser.password);

    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    // Create a JWT token with the user's ID as the payload
    const token = jwt.sign({ id: user.user_id, fn: { user } }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, role: firstuser.role });
  } catch (error) {
    console.error('Error processing login:', error);
    res.status(500).send('Error processing login');
  }
});


// Registration of account 
app.post('/account/register', async (req, res) => {
  const { nric, password, role, query_patient } = req.body;
  // Generate a salt and hash the password
  bcrypt.genSalt(10, async (err, salt) => {
    if (err) {
      console.error('Error generating salt:', err);
      return res.status(500).send('Error generating salt');
    }

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('Error hashing password');
      }

      // Store the user in the database with the hashed password
      const insertUserQuery = 'INSERT INTO users (nric, password,role) VALUES ($1, $2, $3)';
      client.query(insertUserQuery, [nric, hash, role], (err) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).send('Error inserting user');
        }
        client.query(query_patient, (err) => {
          if (err) {
            console.error('Error inserting patient:', err);
            return res.status(500).send('Error inserting patient');
          }
        });
      });
    });
  });
  res.status(201).send();
});


// Forget password
app.put('/account/checkpw', async (req, res) => {
  const { userid, password } = req.body;

  getPassword = "SELECT password FROM users WHERE userid = $1";

  client.query(getPassword, [userid], async (err, result) => {
    if (err) {
      console.error('Error retrieving user data:', err);
      return res.status(500).send('Error retrieving user data');
    }

    // Check if a user with the provided userid exists
    if (result.rows.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    const correctpw = result.rows[0].password;

    try {
      // Compare the provided password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(password, correctpw);

      res.status(200).json({ isMatch: isMatch});

    } catch (error) {
      console.error('Error comparing passwords:', error);
      res.status(500).send('Error comparing passwords');
    }
  });
});


// For Display of Medication Orders based on medicationorder table [ patient-record ]
app.put('/patient/:id', async (req, res) => {
  let id = req.params.id;
  const display = `SELECT mo.orderid, p.full_name, m.medCode, m.medName, mo.medDesc
  FROM medicationorder AS mo
  JOIN medication AS m ON m.medCode = mo.medCode
  JOIN patient AS p ON mo.pid = p.pid
  WHERE p.pid = '${id}'`;

  client.query(display, (err, result) => {
    if (err) {
      return res.status(500).send('Error retrieving medication data');
    }
    res.status(200).send(result);
  });
  client.end;
});


// For update of the medicine table [ medicine.component ] and medicationorder table in [ patient-record.component ] and [view-order-request.component] and medicationorder table in [ encounter.component ] 
app.put('/update', async (req, res) => {
  let updateQuery = req.body.query;

  try {
    // Execute the update query using the pool's client
    client.query(updateQuery);
    // Send a response indicating the update was successful
  } catch (error) {
    console.error('Error occurred while updating data:', error);
    res.status(500).send('An error occurred');
  }
  res.status(204).send();
})

// Update password for [ user-profile.component ]
app.put('/updatepw', async (req, res) => {
  const {query, password , userid} = req.body;
  console.log(password)
  bcrypt.genSalt(10, async (err, salt) => {
    if (err) {
      console.error('Error generating salt:', err);
      return res.status(500).send('Error generating salt');
    }

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('Error hashing password');
      }

      // Update the user's password in the database with the hashed password
      client.query(query, [hash, userid], (err) => {
        if (err) {
          console.error('Error updating user:', err);
          return res.status(500).send('Error updating user');
        }
      });
    });
  });
  res.status(204).send("Password change complete");
})


// For deleting a medicine from medications table [ medicine.component ] 
app.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Execute the update query using the pool's client
    client.query(`DELETE FROM medication WHERE medcode = '${id}'`);
    // Send a response indicating the update was successful
  } catch (error) {
    console.error('Error occurred while updating data:', error);
    res.status(500).send('An error occurred');
  }
  res.status(204).send();
})

// Deleting of a medication record for a patient in medicationorder table [ patient-record]
app.delete('/deleterecord/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Execute the update query using the pool's client
    client.query('DELETE FROM medicationorder WHERE orderid = $1', [id]);
    // Send a response indicating the update was successful
  } catch (error) {
    console.error('Error occurred while updating data:', error);
    res.status(500).send('An error occurred');
  }
  res.status(204).send();
})

// For creating a medication order for patient in medicationorder table [ create-patient-medicine-popup ] and 
// creating of new medicine in medication table [ create-medicine-popup ]
app.post('/create', async (req, res) => {
  let updateQuery = req.body.query;
  try {
    // Execute the update query using the pool's client
    client.query(updateQuery);
    // Send a response indicating the update was successful
  } catch (error) {
    console.error('Error occurred while updating data:', error);
    res.status(500).send('An error occurred');
  }
  res.status(201).send();
})

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send('No token provided');
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }

    req.userId = decoded.id;
    next();
  });
}

// Apply the middleware to the relevant routes
app.get('/protected-route', authenticateToken, (req, res) => {
  // Only authenticated users can access this route
  // The user ID can be accessed using req.userId
});

client.connect();