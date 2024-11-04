import express from 'express';
import fs from 'fs/promises';

const app = express();
app.use(cors({
    origin: '*'
}));

const port = process.env.PORT || 3001;

let jsonData;

// Load JSON data asynchronously before starting the server
const readJson = async () => {
    const data = await fs.readFile('data.json', 'utf-8');
    jsonData = JSON.parse(data);
};

readJson().then(() => {
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
});

//returns information detail about the chosen place
app.get('/name/:name', (req, res) => {
    console.log("REQUEST")
    const placeName = req.params.name.substring(1).toLowerCase(); //to make it not case sensitive
    console.log(placeName)
    const categories = ['restaurant', 'shop', 'cafe']; //create array for the catrgory parent in the json data

    categories.forEach((category) => { //loop through category
        if (jsonData[category]) {
            jsonData[category].forEach((place) => {
                if (place.name.toLowerCase() === placeName) { //if place name searched matches the placeName in the json,
                    res.send({ //send these information
                        name: place.name,
                        address: place.address,
                        rating: place.rating,
                        desc: place.desc
                    });
                }
            });
        }
    });
});


//returns array of places based on rating    
app.get('/rating', (req, res) => {
    const reqRating = parseFloat(req.query.min); //converts string (rating input) to decimal number

    let ratedPlace = []; //make empty array
    const categories = ['restaurant', 'shop', 'cafe']; //array of category parent

    categories.forEach((category) => { //loop through all categories
        if (jsonData[category]) {
            jsonData[category].forEach((place) => {
                const placeRating = parseFloat(place.rating);
                if (placeRating >= reqRating) { //if place from the JSON data has a rating bigger or equals to what was requested,
                    ratedPlace.push(place.name)
                    ratedPlace.push(place.rating);//push into the array
                }
            });
        }
    });

    res.send(ratedPlace);//display to client side
});

//returns list of name of places that fits within the category
app.get('/spot', (req, res) => {
    const reqCategory = req.query.category; 
    const categoryList = []; //make empty array
    
    if (jsonData[reqCategory]) {

        jsonData[reqCategory].forEach((place) => { //loop through category paren
        categoryList.push(place.name);//push name into array if match with what was searched
        });
        res.send(categoryList); //display it in client side
    } 
    });


    //url is better for 1 thing in return
    //query is for filtering and multiple responses
