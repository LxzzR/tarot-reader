// NAMESPACE OBJECT 
const app = {};

// HANDLES USER CHOICE EVENT LISTENERS
// Single Card Spread
app.handleOneCard = () => {
  $('#one').on('click', () => {
    app.showCards();
    app.getTarot('random_card');
  })
}

// Three Card Spread
app.handleThreeCards = () => {
  $('#three').on('click', () => {
    app.showCards();
    app.getTarot('three_cards');
  })
}

// REMOVES USER BUTTON CONTAINER AND SHOWS TAROT CARD CONTAINTER
app.showCards = () => {
  $('.tarot').removeClass('hide');
  $('.tarot').addClass('animate').addClass('fadeIn');
  $('.users-choice').addClass('hide');
  setTimeout(() => {
    $('.draw-card').removeClass('hide');
    $('.draw-card').addClass('animate').addClass('fadeIn');
  }, 1000);
}

// HANDLES EVENT LISTENER TO DISPLAY INFO ABOUT THE USER OPTIONS
app.handleInfoBtn = () => {
  $('.info-btn').on('click', () => {
    $('.info-modal-box').addClass('animate').addClass('fadeIn');
    $('.info-modal').removeClass('hide');
    $('.info-modal-box').removeClass('hide');
  })
}

// CALLS AJAX API 
app.getTarot = (userOption) => {
  $.ajax({
    url: `https://tarot.howlcode.com/api/v1/spreads/${userOption}`,
    method: 'GET',
    dataType: 'json',
  }).then(function(res) {
    // Displays api data on the page
    app.displayTarot(res, userOption);
    // Handles click event to open tarot modal
    app.handleOpenModal(res);
  })
}

// DISPLAYS TAROT CARD API DATA ON PAGE
app.displayTarot = (res, userOption) => {
  if (userOption === 'random_card') {
    $('.tarot').html(app.cardHtml(res, 0, userOption));
  } else if (userOption === 'three_cards') {
    $('.tarot').html(app.cardHtml(res, 0)).append(app.cardHtml(res, 1)).append(app.cardHtml(res, 2));
  }
}

//RETURNS REUSABLE TAROT CARD HTML STAMP  
app.cardHtml = (res, num, title) => {
  const tarotObj = res[num];
  let tarot;
  // Sets appropraite variables to be passed into HTML
  if (title) {
    tarot = 'your-card';
  } else if (num === 0) {
    tarot = 'past';
  } else if (num === 1) {
    tarot = 'present';
  } else if (num === 2) {
    tarot = 'future';
  }
  // Returns appropriate API populated HTML block
  return `
    <div class="tarot-card">
      <h2>${tarot.split('-').join(' ')}</h2>
      <button id="${tarot}" class="img-wrapper" aria-label="first card">
        <img src="${tarotObj.image}" alt="${tarotObj.name}" />
      </button>
    </div>
    `;
}
// RESUABLE HTML RETURN ENDS --

// HANDLES MODAL EVENT LISTENER AND REVEALS INFO ABOUT CURRENT CARD
app.handleOpenModal = (res) => {
  $('.img-wrapper').click(function (e) {
    const target = (e.currentTarget);
    const id = (e.currentTarget.id);
    $(target).addClass('clicked');
    $('.tarot-modal-box').removeClass('hide');
    $('.tarot-modal').removeClass('hide');
    // Displays API data in modal
    app.displayModal(res, id);
  });
}

// DISPLAYS CLICKED CARD API DATA
app.displayModal = (res, id) => {
  let num;
  // Checks clicked card and set variables accordingly
  if (id === 'past' || id === 'your-card') {
    num = 0;
  } else if (id === 'present') {
    num = 1;
  } else if (id === 'future') {
    num = 2;
  }
  app.generateModalContent(res, num, id);
}


// POPULATES MODAL CONTENT
app.generateModalContent = (res, num, id) => {
  const tarotObj = res[num];
  $('.modal-img').attr('src', `${tarotObj.image}`, 'alt', `${tarotObj.name}`);
  $('.modal-title').text(id.split('-').join(' '));
  $('.modal-card').text(`${tarotObj.name.split('-').join(' ')}`);
  $('.keywords.upright').text(`Upright: ${tarotObj.upright}`);
  $('.keywords.reversed').text(`Reversed: ${tarotObj.reversed}`);
  $('.summary').text(`${tarotObj.full_meaning}`);
}


// HANDLES MODAL-CLOSE EVENT LISTENERS
app.handleLeaveModal = (modal) => {
  // Handles click on close button
  $(`.${modal}-close`).on('click', () => {
    app.closeModal(modal);
  })
  // Handles click outside content to close modal 
  $(`.${modal}-modal`).on('click', () => {
    app.closeModal(modal);
  })
}

// CLOSES MODALS 
app.closeModal = (modal) => {
  $(`.${modal}-modal`).addClass('hide');
  $(`.${modal}-modal-box`).addClass('hide');
}

// HANDLES DRAW AGAIN
app.handleDraw = () => {
  $('.draw').on('click', () => {
    $('.tarot').addClass('hide');
    $('.draw-card').addClass('hide');
    $('.users-choice').addClass('animate').addClass('fadeIn');
    $('.users-choice').removeClass('hide');
  })
}

// INITIALIZES APPLICATION
app.init = () => {
  app.handleOneCard();
  app.handleThreeCards();
  app.handleInfoBtn();
  app.handleLeaveModal('info');
  app.handleLeaveModal('tarot');
  app.handleDraw();
}

// CALLS THE APPLICATION
app.init();


