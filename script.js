//hamburger menu bar//
//  function toggleMenu() {

//    let menu = document.getElementById('menu');
//      menu.classList.toggle('show');
//  }

//  axios.get('https://dummyjson.com/recipes')
//  .then(function (response){
//     console.log(response)
//  })
// .catch(function (error){
//     console.log(error)
//   })
// .finally(function(){
//     console.log("Get request done")
// })

//plant health identifier 

    function uploadAndIdentifyPlantID(){
    //retrieve photo from the frontend
    const photoInput = document.getElementById('photoInput');

//if no photos are selected , it alerts the user to upload a photo    
    if(photoInput.files.length === 0) {
        alert('Please select a photo to upload');
        return;
    }
 //selecting the first file from the files array of an input element   
    const selectedFile = photoInput.files[0];

//create a new file reader object so that we can read the contents of the file
    const reader = new FileReader ();

//set up event handler for the onload for the file reader
// object on the onload event is triggered when the reading operation of the file is completed
    reader.onload = function (e) {
//store the base64image in a variable
    const base64Image = e.target.result;
    console.log('base64Image',base64Image);


    //store all the variables for the API call
    const apiKey = '1QOSc97YFCiDnIShp6dkCBSMhxqvWI5pSZLZosZQlVFJxld58I';
    const latitude = 49.207;
    const longitude = 16.608;
    const health = 'all';
    const similarImages = true; 
    const details = 'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods,treatment,cause'
    const language = 'en';
    const apiUrlPlantID = `https://plant.id/api/v3/identification?details=${details}&language=${language}`;
    
    //making first API call with the base 64image
    axios.post(apiUrlPlantID,{
        'images': [base64Image],
        'latitude': latitude,
        'longitude': longitude,
        'health': health,
        'similar_images': similarImages,
   },{
      headers: {
        'Api-Key': apiKey,
        'Content-Type': "application/json"
      }  
    })
    //succesful state of promise
    .then(function (response) {
        console.log('Response from Plant ID API',response.data);
        displayPlantIDInfo(response.data,base64Image);
    })
    //error state of promise
    .catch(function(error) {
        alert(`Error:${error}❌❌❌`);
        console.error('Error', error);
    });
};

//read the selected file as a data URL which is a base64 encoded representation of the file's content
    reader.readAsDataURL(selectedFile);
}

function displayPlantIDInfo(plantIdResponse,base64Image){
    
//variable to store first suggestion 



    const plantIdClassification = plantIdResponse.result.classification;
    const plantIdDisease = plantIdResponse.result.disease;
    const plantIdIsHealthy = plantIdResponse.result.is_healthy;
    const plantIdIsPlant = plantIdResponse.result.is_plant;

          //plan preview image 

    //grab the preview image element from the front plantidentifier.html
    const previewImage = document.getElementById('previewImage')
    //set the image HTML src attribute to the preview image we uploaded on the plantidentifier html file
    previewImage.src = base64Image


            //PLANT NAME
    // grab the HTML for the plant title container 
    const plantNameContainer = document.getElementById('plant-name-container');
    //create a new <p> tag element for the plant title 
    const plantNameElement = document.createElement('p');
    //add the name of the plant to the innerHTML of the <p> tag we created 
    plantNameElement.innerHTML = `<strong> Name: </strong>${plantIdClassification.suggestions[0].name}`

    //append the new div we created to the api result container 
    plantNameContainer.appendChild(plantNameElement);


    //similar image

    //grab the similiar image from the api reponse
    const plantSimilarImage = plantIdClassification.suggestions[0].similar_images[0].url;
    //grab the html where the image will be placed 
    const similarImageHTML = document.getElementById('plant-similar-image');
    //set the image HTML src attribute 
    similarImageHTML.src = plantSimilarImage;
    

    //PROBABILITY 

    //grab the probability score from the API response 
    const probabilityOfPlantId = plantIdClassification.suggestions[0].probability;
    //grab the HTML where the probability will be placed
    const probabilityNameContainer = document.getElementById('probability-container');
    //create a new <p> tag element for the probability text
    const probabilityNameElement = document.createElement('p');
    //add the probability text to the innnerHTML of the new <p> tag created
    probabilityNameElement.innerHTML = `<strong> Probability: </strong>${probabilityOfPlantId}`;
    //append the new div we created to the probabilityNameContainer we grabbed from html
    probabilityNameContainer.appendChild(probabilityNameElement);

    //is it a plant or not? 
    //grab the is plant boolean value from the API response
    const isPlant = plantIdIsPlant.binary;
    //grab the HTML where the is plant status will be placed
    const isPlantContainer = document.getElementById('isPlant-container');
    //create a new <p> tag element for the is plant boolean
    const isPlantElement = document.createElement('p');
    //check if the image  submitted is a plant , if not , alert the user
    if (isPlant===false){
        alert('The picture you submitted is not a plant❌❌❌.Please try again');
        //reload the page
        window.location.reload();
    }

    //add the boolean text to the innerHTML of the new p tag we created
    isPlantElement.innerHTML = `<strong>Is PLant: </strong> ${isPlant}`;
    //append the new div we created to the isPlantContainer we
    isPlantContainer.appendChild(isPlantElement)

    //COMMON NAME 
if(plantIdClassification.suggestions[0].details.common_names !== null){
    //grab the first common name from the api response 
    const commonName = plantIdClassification.suggestions[0].details.common_names[0];
    //grab the HTML where the common name will be placed
    const commonNameContainer = document.getElementById('common-name-container');
    //create a new <p> tag element for the common name text
    const commonNameElement = document.createElement('p');
    //add the common name text to the inner html of the new <p> tag we created
    commonNameElement.innerHTML = `<strong>Common Name: </strong> ${commonName}`;
    //appned the new div we created to the commonnamecontainer
    commonNameContainer.appendChild(commonNameElement);
}


    //DESCRIPTION

    //grab value from api response
    const plantDescription = plantIdClassification.suggestions[0].details.description.value;
    //grab the container from frontend 
    const descriptionContainer = document.getElementById('description-container');
    //create a new <p> tag element for the description text
    const descriptionElement = document.createElement('p');
    //add the description text to the inner html of the new <p> tag we created
    descriptionElement.innerHTML = `<strong>Description: </strong> ${plantDescription}`;
    //append the new div we created to the container we grabbed from our html
    descriptionContainer.appendChild(descriptionElement);

    //PLANT HEALTH STATUS
    //grab value from api response
    const plantHealhStatus = plantIdIsHealthy.binary;
    //grab the container from frontend
    const plantHealthStatusContainer = document.getElementById('plant-health-status-container');
    //create a new p tag element 
    const plantHealthStatusElement = document.createElement('p');
    //add the text to the inner html of the new p tage we created 
    plantHealthStatusElement.innerHTML = `<strong>Is the plant healthy: </strong> ${plantHealhStatus}`;
    //append the new div we created to the container we grabbed from our html
    plantHealthStatusContainer.appendChild(plantHealthStatusElement);


    //similar image with disease
    //grab similar image from api repsponse
    const plantSimilarImageWithDisease = plantIdDisease.suggestions[0].similar_images[0].url;
    //grab html where img will be placed
    const similarImageWithDiseaseHTML= document.getElementById('plant-similar-image-with-disease');
    //set the image html src attribute to the image
    similarImageWithDiseaseHTML.src = plantSimilarImageWithDisease;


    //DISEASE NAME
    //grab value from api response 
    const plantDiseaseName = plantIdDisease.suggestions[0].name;
    //grab container from frontend
    const plantDiseaseNameContainer = document.getElementById('plant-disease-name-container')
    //create a new p tag element
    const plantDiseaseNameElement = document.createElement('p');
    //add the disease name to the inner html of the new p tag we created
    plantDiseaseNameElement.innerHTML = `<strong> Disease: </strong> ${plantDiseaseName}`;
    //append the new div we created to the container we grabbed from our html
    plantDiseaseNameContainer.appendChild(plantDiseaseNameElement);

    // =========================================
// DISEASE PROBABILITY
// =========================================
// Grab value from API response
    const plantDiseaseProbability = plantIdDisease.suggestions[0].probability;
// Grab container from the front end HTML
    const plantDiseaseProbabilityContainer = document.getElementById('plant-disease-probability');
// create a new <p> tag element
    const plantDiseaseProbabilityElement = document.createElement('p');
// add text to the innerHTML of the new <p> tag we created
    plantDiseaseProbabilityElement.innerHTML = `<strong>Disease Probability:</strong> ${plantDiseaseProbability}`;
// append the new div we created to the container we grabbed from our html
    plantDiseaseProbabilityContainer.appendChild(plantDiseaseProbabilityElement);

// =========================================
// DISEASE DESCRIPTION
// =========================================
// Grab value from API response
    const plantDiseaseDescription = plantIdDisease.suggestions[0].details.description;
// Grab container from the front end HTML
    const plantDiseaseDescriptionContainer = document.getElementById('plant-disease-description');
// create a new <p> tag element
    const plantDiseaseDescriptionElement = document.createElement('p');
// add text to the innerHTML of the new <p> tag we created
    plantDiseaseDescriptionElement.innerHTML = `<strong>Disease Description:</strong> ${plantDiseaseDescription}`;
// append the new div we created to the container we grabbed from our html
    plantDiseaseDescriptionContainer.appendChild(plantDiseaseDescriptionElement);

// =========================================
// DISEASE TREATMENT [💡 SAVE THE BEST FOR LAST USE A LOOP IN THE API FOR TREATMENTS]
// =========================================
// Grab value from API response
    const plantDiseaseTreatment = plantIdDisease.suggestions[0].details.treatment;
// Grab container from the front end HTML
    const plantDiseaseTreatmentContainer = document.getElementById('plant-disease-treatment');
// create a new <p> tag element
    const plantDiseaseTreatmentElement = document.createElement('p');

// Do a check if the plant is dead and the object is empty, we let the user know that there is no treatment available for dead plants
    if (Object.keys(plantDiseaseTreatment).length === 0) {
  // add text to the innerHTML of the new <p> tag we created
    plantDiseaseTreatmentElement.innerHTML = `<strong>Disease Treatment:</strong> No treatment available`;
  // append the new div we created to the container we grabbed from our html
    plantDiseaseTreatmentContainer.appendChild(plantDiseaseTreatmentElement);
}

// loop through the object and map keys to values
// then attach them to the HTML container
    for (const key in plantDiseaseTreatment) {
  // if the object has a key-value pair
    if (plantDiseaseTreatment.hasOwnProperty(key)) {
    // create a variable and store the value of each key on each iteration
    const plantDiseaseTreatmentValues = plantDiseaseTreatment[key].map(value => `<li>${value}</li>`).join('');
    // create a variable that matches the key with the values and wrap them in HTML
    const plantDiseaseTreatmentText = `<strong>Disease Treatment ${key}:</strong> <ul>${plantDiseaseTreatmentValues}</ul>`;
    // append the text of the key-value pairs into the HTML container
    plantDiseaseTreatmentContainer.innerHTML += plantDiseaseTreatmentText;
  }
}
    }




   




    
    
    










  


     


