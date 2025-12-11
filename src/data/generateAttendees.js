/**
 * Script to generate 250 attendees JSON file
 * Run with: node src/data/generateAttendees.js
 */

const fs = require('fs')
const path = require('path')

const registrationTypes = [
  'Media',
  'Investor',
  'Sell-Side Analyst',
  'Starbucks Leadership',
  'Starbucks Staff',
  'General Attendee'
]

const drinkTypes = [
  'Latte',
  'Cappuccino',
  'Americano',
  'Mocha',
  'Espresso',
  'Frappuccino',
  'Cold Brew',
  'Tea',
  'Hot Chocolate',
  'None'
]

const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica',
  'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Melissa', 'Daniel',
  'Nicole', 'Matthew', 'Michelle', 'Anthony', 'Kimberly', 'Mark', 'Lisa',
  'Donald', 'Nancy', 'Steven', 'Karen', 'Paul', 'Betty', 'Andrew', 'Helen',
  'Joshua', 'Sandra', 'Kenneth', 'Donna', 'Kevin', 'Carol', 'Brian', 'Ruth',
  'George', 'Sharon', 'Edward', 'Ronald', 'Laura', 'Timothy', 'Jason',
  'Deborah', 'Ryan', 'Jacob', 'Gary', 'Emma', 'Olivia', 'Noah', 'Ava',
  'Liam', 'Sophia', 'Mason', 'Isabella', 'James', 'Mia', 'Benjamin', 'Charlotte',
  'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Jackson', 'Abigail',
  'Sebastian', 'Emily', 'Aiden', 'Elizabeth', 'Matthew', 'Mila', 'Samuel', 'Ella',
  'David', 'Avery', 'Joseph', 'Sofia', 'Carter', 'Camila', 'Owen', 'Aria',
  'Wyatt', 'Scarlett', 'John', 'Victoria', 'Jack', 'Madison', 'Luke', 'Luna',
  'Jayden', 'Grace', 'Dylan', 'Chloe', 'Grayson', 'Penelope', 'Levi', 'Layla',
  'Isaac', 'Riley', 'Gabriel', 'Zoey', 'Julian', 'Nora', 'Mateo', 'Lily',
  'Anthony', 'Eleanor', 'Jaxon', 'Hannah', 'Lincoln', 'Lillian', 'Joshua', 'Addison',
  'Christopher', 'Aubrey', 'Andrew', 'Ellie', 'Theodore', 'Stella', 'Caleb', 'Natalie',
  'Ryan', 'Zoe', 'Asher', 'Leah', 'Nathan', 'Hazel', 'Thomas', 'Violet',
  'Leo', 'Aurora', 'Isaiah', 'Savannah', 'Charles', 'Audrey', 'Josiah', 'Brooklyn',
  'Hudson', 'Bella', 'Christian', 'Claire', 'Hunter', 'Skylar', 'Connor', 'Lucy',
  'Eli', 'Paisley', 'Jonathan', 'Everly', 'Aaron', 'Anna', 'Landon', 'Caroline',
  'Adrian', 'Nova', 'Colton', 'Genesis', 'Easton', 'Aaliyah', 'Angel', 'Kennedy',
  'Brayden', 'Kinsley', 'Jordan', 'Allison', 'Nicholas', 'Maya', 'Robert', 'Sarah',
  'Tyler', 'Madelyn', 'Evan', 'Adeline', 'Dominic', 'Alexa', 'Austin', 'Ariana',
  'Adam', 'Elena', 'Ian', 'Gabriella', 'Nolan', 'Naomi', 'Cooper', 'Alice',
  'Carson', 'Sadie', 'Xavier', 'Hailey', 'Jaxson', 'Eva', 'Jose', 'Emilia',
  'Jace', 'Autumn', 'Jameson', 'Quinn', 'Leonardo', 'Nevaeh', 'Bryson', 'Piper',
  'Axel', 'Ruby', 'Everett', 'Serenity', 'Kayden', 'Willow', 'Miles', 'Eliana',
  'Sawyer', 'Ivy', 'Jason', 'Brielle', 'Kaiden', 'Liliana', 'Declan', 'Aaliyah',
  'Colin', 'Maria', 'Chase', 'Gianna', 'Bentley', 'Valentina', 'Ryder', 'Isla',
  'Brandon', 'Clara', 'Kevin', 'Hadley', 'Parker', 'Reagan', 'Blake', 'Vivian'
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris',
  'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'King',
  'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson',
  'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell',
  'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris',
  'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera',
  'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres', 'Peterson', 'Gray',
  'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett',
  'Wood', 'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell',
  'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler', 'Simmons',
  'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Diaz',
  'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace', 'Woods',
  'Cole', 'West', 'Jordan', 'Owens', 'Reynolds', 'Fisher', 'Ellis', 'Harrison',
  'Gibson', 'Mcdonald', 'Cruz', 'Marshall', 'Ortiz', 'Gomez', 'Murray', 'Freeman',
  'Wells', 'Webb', 'Simpson', 'Stevens', 'Tucker', 'Porter', 'Hunter', 'Hicks',
  'Crawford', 'Henry', 'Boyd', 'Mason', 'Morales', 'Kennedy', 'Warren', 'Dixon',
  'Ramos', 'Reyes', 'Burns', 'Gordon', 'Shaw', 'Holmes', 'Rice', 'Robertson',
  'Hunt', 'Black', 'Daniels', 'Palmer', 'Mills', 'Nichols', 'Grant', 'Knight',
  'Ferguson', 'Rose', 'Stone', 'Hawkins', 'Dunn', 'Perkins', 'Hudson', 'Spencer',
  'Gardner', 'Stephens', 'Payne', 'Pierce', 'Berry', 'Matthews', 'Arnold', 'Wagner',
  'Willis', 'Ray', 'Watkins', 'Olson', 'Carroll', 'Duncan', 'Snyder', 'Hart',
  'Cunningham', 'Bradley', 'Lane', 'Andrews', 'Ruiz', 'Harper', 'Fox', 'Riley',
  'Armstrong', 'Carpenter', 'Weaver', 'Greene', 'Lawrence', 'Elliott', 'Chavez',
  'Sims', 'Austin', 'Peters', 'Kelley', 'Franklin', 'Lawson', 'Fields', 'Gutierrez',
  'Ryan', 'Schmidt', 'Carr', 'Vasquez', 'Castillo', 'Wheeler', 'Chapman', 'Oliver',
  'Montgomery', 'Richards', 'Williamson', 'Johnston', 'Banks', 'Meyer', 'Bishop',
  'Mccoy', 'Howell', 'Alvarez', 'Morrison', 'Hansen', 'Fernandez', 'Garza', 'Harvey',
  'Little', 'Burton', 'Stanley', 'Nguyen', 'George', 'Jacobs', 'Reid', 'Kim',
  'Fuller', 'Lynch', 'Dean', 'Gilbert', 'Garrett', 'Romero', 'Welch', 'Larson',
  'Frazier', 'Burke', 'Hanson', 'Day', 'Mendoza', 'Moreno', 'Bowman', 'Medina',
  'Fowler', 'Brewer', 'Hoffman', 'Carlson', 'Silva', 'Pearson', 'Holland', 'Douglas',
  'Fleming', 'Jensen', 'Vargas', 'Byrd', 'Davidson', 'Hopkins', 'May', 'Terry',
  'Herrera', 'Wade', 'Soto', 'Walters', 'Curtis', 'Neal', 'Caldwell', 'Lowe',
  'Jennings', 'Barnett', 'Graves', 'Jimenez', 'Horton', 'Shelton', 'Barrett', 'Obrien',
  'Castro', 'Sutton', 'Gregory', 'Mckinney', 'Lucas', 'Miles', 'Craig', 'Rodriquez',
  'Chambers', 'Holt', 'Lambert', 'Fletcher', 'Watts', 'Bates', 'Hale', 'Rhodes',
  'Pena', 'Beck', 'Newman', 'Haynes', 'McDaniel', 'Mendez', 'Bush', 'Vaughn',
  'Parks', 'Dawson', 'Santiago', 'Norris', 'Hardy', 'Love', 'Steele', 'Curry',
  'Powers', 'Schultz', 'Barker', 'Guzman', 'Page', 'Munoz', 'Ball', 'Keller',
  'Chandler', 'Weber', 'Leonard', 'Walsh', 'Lyons', 'Ramsey', 'Wolfe', 'Schneider',
  'Mullins', 'Benson', 'Sharp', 'Bowen', 'Daniel', 'Barber', 'Cummings', 'Hines',
  'Baldwin', 'Griffith', 'Valdez', 'Hubbard', 'Salazar', 'Reeves', 'Warner', 'Stevenson',
  'Burgess', 'Santos', 'Tate', 'Cross', 'Garner', 'Mann', 'Mack', 'Moss',
  'Thornton', 'Dennis', 'Mcgee', 'Farmer', 'Delgado', 'Aguilar', 'Vega', 'Glover',
  'Manning', 'Cohen', 'Harmon', 'Rodgers', 'Robbins', 'Newton', 'Todd', 'Blair',
  'Higgins', 'Ingram', 'Reese', 'Cannon', 'Strickland', 'Townsend', 'Potter', 'Goodwin',
  'Walton', 'Rowe', 'Hampton', 'Ortega', 'Patton', 'Swanson', 'Joseph', 'Combs',
  'Petty', 'Cochran', 'Brewer', 'Brock', 'Preston', 'Small', 'Whitney', 'Wiggins',
  'Bridges', 'Tillman', 'Wynn', 'Finley', 'Dillard', 'Snell', 'Rocha', 'McIntyre',
  'Larsen', 'Roach', 'Nash', 'Blanchard', 'Stark', 'Brady', 'Trevino', 'Boyle',
  'Mclaughlin', 'Marks', 'Cline', 'Noble', 'Wolf', 'Crane', 'Burgess', 'Bentley',
  'Spence', 'Gardner', 'Carrillo', 'Mclaughlin', 'Hendricks', 'Vang', 'Pham', 'Gallagher',
  'Anthony', 'Dickson', 'Blevins', 'Ramos', 'Mays', 'Mcmillan', 'Klein', 'Espinoza',
  'Buchanan', 'Norton', 'Pierce', 'Preston', 'Conner', 'Adkins', 'Figueroa', 'Harmon',
  'Rosario', 'Lugo', 'Townsend', 'Bentley', 'Vance', 'Valencia', 'Carrillo', 'Clay',
  'Powers', 'Maynard', 'Mccall', 'Hendrix', 'Brennan', 'Stanton', 'Mccormick', 'Bowers',
  'Shields', 'Griffin', 'Solomon', 'Wong', 'Walter', 'Hartman', 'Fischer', 'Rhodes',
  'Haney', 'Mcbride', 'Harvey', 'Patton', 'Lopez', 'Brady', 'Mccormick', 'Brennan',
  'Haley', 'Mendez', 'Gentry', 'Lara', 'Shepherd', 'Frye', 'Carr', 'Mccarthy',
  'Blackburn', 'Clarke', 'Buckley', 'Meadows', 'Strong', 'Bartlett', 'Woodard', 'Boyle',
  'Mclain', 'Bauer', 'House', 'Mcclain', 'Stout', 'Mclaughlin', 'Huffman', 'Duffy',
  'Landry', 'Fitzgerald', 'Mccann', 'Banks', 'Mccarthy', 'Mccormick', 'Mccall', 'Mccann',
  'Mccarthy', 'Mccormick', 'Mccall', 'Mccann', 'Mccarthy', 'Mccormick', 'Mccall', 'Mccann'
]

function generateAttendee(id) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@example.com`
  const registrationType = registrationTypes[Math.floor(Math.random() * registrationTypes.length)]
  const drinkType = drinkTypes[Math.floor(Math.random() * drinkTypes.length)]
  
  // Logic: Can only receive badge/drink if checked in
  const checkedIn = Math.random() > 0.3 // 70% checked in
  const receivedBadge = checkedIn && Math.random() > 0.2 // 80% of checked in received badge
  const receivedDrink = checkedIn && Math.random() > 0.4 // 60% of checked in received drink

  return {
    id: id.toString(),
    firstName,
    lastName,
    email,
    registrationType,
    drinkType,
    checkedIn,
    receivedBadge,
    receivedDrink
  }
}

function generateAllAttendees(count = 250) {
  const attendees = []
  for (let i = 1; i <= count; i++) {
    attendees.push(generateAttendee(i))
  }
  return attendees
}

// Generate the data
const attendees = generateAllAttendees(250)

// Write to file
const filePath = path.join(__dirname, 'attendees.json')
fs.writeFileSync(filePath, JSON.stringify(attendees, null, 2), 'utf8')

console.log(`✅ Generated ${attendees.length} attendees`)
console.log(`📁 File saved to: ${filePath}`)

// Print some statistics
const stats = {
  total: attendees.length,
  checkedIn: attendees.filter(a => a.checkedIn).length,
  receivedBadge: attendees.filter(a => a.receivedBadge).length,
  receivedDrink: attendees.filter(a => a.receivedDrink).length,
  byRegistrationType: registrationTypes.reduce((acc, type) => {
    acc[type] = attendees.filter(a => a.registrationType === type).length
    return acc
  }, {})
}

console.log('\n📊 Statistics:')
console.log(`Total: ${stats.total}`)
console.log(`Checked In: ${stats.checkedIn}`)
console.log(`Received Badge: ${stats.receivedBadge}`)
console.log(`Received Drink: ${stats.receivedDrink}`)
console.log('\nBy Registration Type:')
Object.entries(stats.byRegistrationType).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`)
})

