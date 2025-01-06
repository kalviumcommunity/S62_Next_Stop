const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/my_database'; 
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));


  const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  age: {
    type: Number,
    required: true,
    min: [18, 'Age must be at least 18'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

const createUsers = async () => {
  try {
    const user1 = new User({
      name: 'Danushri',
      email: 'danushri.prakashsaranya@gmail.com',
      age: 18,
    });

    const user2 = new User({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      age: 30,
    });

    await user1.save();
    await user2.save();

    console.log('Users saved successfully!');
  } catch (err) {
    console.error('Error inserting users:', err);
  }
};


const getUsers = async () => {
  try {
    const users = await User.find();
    console.log('All users:', users);
  } catch (err) {
    console.error('Error fetching users:', err);
  }
};

createUsers();
getUsers();
