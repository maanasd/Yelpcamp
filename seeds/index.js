const mongoose = require('mongoose');
const { $where } = require('../models/campground');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places , descriptors} = require('./seedHelpers');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('mongo connected')
}

const sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i=0; i<50 ; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            author: '6254da4c7265d1eb0330052c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})

