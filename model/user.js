/*
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2023-12-27 13:33:32
 * @Description:
 */
async function addUser(db, data) {
  const stmt = db.prepare('INSERT INTO users (name, password, create_time) VALUES (?, ?, ?)')
  const info = stmt.run(data.name, data.password, new Date().toLocaleString())
  return info
}

async function getUser(db) {
  const stmt = db.prepare('select * from users')
  const data = stmt.all()
  return data
}

module.exports = {
  addUser,
  getUser,
}
