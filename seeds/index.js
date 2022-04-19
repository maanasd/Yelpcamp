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
    for (let i=0; i<200 ; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
          // Your user id
            author: '6254da4c7265d1eb0330052c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dmuiroxhm/image/upload/v1649971955/Yelpcamp/xrkqfgg5axxuxctwsmkl.jpg',
                  filename: 'Yelpcamp/xrkqfgg5axxuxctwsmkl',
                },
                {
                  url: 'https://res.cloudinary.com/dmuiroxhm/image/upload/v1649977018/Yelpcamp/csbsmb4c2xenenfqujy2.webp',
                  filename: 'Yelpcamp/csbsmb4c2xenenfqujy2',                
                },
                {
                  url: 'https://res.cloudinary.com/dmuiroxhm/image/upload/v1649977019/Yelpcamp/gcosnlogg4q3ptzburie.jpg',
                  filename: 'Yelpcamp/gcosnlogg4q3ptzburie',
                }
              ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price,
            geometry:{
              type: 'Point',
              coordinates: [
               cities[random1000].longitude,
               cities[random1000].latitude]
            }
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})

