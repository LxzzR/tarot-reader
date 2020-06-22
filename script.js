// NameSpace object
const app = {};

// Activity types as defined by BORED API
app.types = ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"]

// Generate random activity
app.num = Math.round(Math.random() * app.types.length)
app.type = app.types[app.num];

// All the Bored API
app.getActivity = (query) => {
  $.ajax({
    url: `http://www.boredapi.com/api/activity?type=r${query}`,
    method: 'GET',
    dataType: 'json',
    data: {
      type: query,
    }
  }).then(function(res) {
    const activity = res.activity;
    app.showActivity(activity);
  })
}

// Display activity suggestion
app.showActivity = (data) => {
  $('.results').append(`According to our calaculations, you should:<br>
  ${data}`);
}

// Turn the card transition
app.flipCard = () => {
  $('button').on('click', function() {
    console.log('something works');
  })
}

// Initialize
app.init = () => {
  // Call the getActivity function 
  app.getActivity(app.type);
  app.flipCard();
}


app.init();
