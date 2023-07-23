const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Load the USERS.json file
const users = JSON.parse(fs.readFileSync('USERS.json', 'utf8'));

// Hash each user's password
const usersWithHashedPasswords = users.map(user => {
  const hash = bcrypt.hashSync(user.password, saltRounds);
  return { ...user, password: hash };
});

// Save the new JSON file
fs.writeFileSync('USERS_HASHED.json', JSON.stringify(usersWithHashedPasswords));