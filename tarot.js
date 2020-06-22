// NAMESPACE OBJECT 
const app = {};

// HANDLES USER CHOICE
app.handleOneCard = () => {
  $('#one').on('click', () => {
    app.showCards();
    app.getTarot('random_card');
  })
}

app.handleThreeCards = () => {
  $('#three').on('click', () => {
    app.showCards();
    app.getTarot('three_cards');
  })
}

// REMOVES USER BUTTON CONTAINER AND SHOWS TAROT CARD CONTAINTER
app.showCards = () => {
  $('.users-choice').addClass('hide');
  $('.tarot').removeClass('hide');
}

// HANDLES EVENT LISTENER FOR INFORMATION BTN
app.handleInfoBtn = () => {
  $('.info-btn').on('click', () => {
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
    app.displayTarot(res, userOption);
    app.handleOpenModal(res);
  })
}

// DISPLAYS CARD LAYOUT
app.displayTarot = (res, userOption) => {
  if (userOption === 'random_card') {
    $('.tarot').html(app.cardHtml(res, 0, userOption));
  } else if (userOption === 'three_cards') {
    $('.tarot').html(app.cardHtml(res, 0)).append(app.cardHtml(res, 1)).append(app.cardHtml(res, 2));
    };
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
        <img src="${tarotObj.image}" alt="${res[num].name}" />
      </button>
      <h3 class="card-name">${res[num].name.split('-').join(' ')}</h3>
    </div>
    `;
}

// HANDLES MODAL POP-POP EVENT LISTENER AND REVEALS CARD
app.handleOpenModal = (res) => {
  $('.img-wrapper').click(function (e) {
    const id = (e.currentTarget.id);
    $(e.currentTarget).addClass('clicked');
    $('.tarot-modal-box').removeClass('hide');
    $('.tarot-modal').removeClass('hide');
    app.displayModal(res, id);
  });
}

// POPULATES MODAL CONTENT
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

// GENERATES MODAL CONTENT
app.generateModalContent = (res, num, id) => {
  const tarotObj = res[num];
  $('.modal-img').attr('src', `${tarotObj.image}`, 'alt', `${tarotObj.name}`);
  $('.modal-title').text(id);
  $('.modal-card').text(`${tarotObj.name.split('-').join(' ')}`);
  $('.keywords.upright').text(`Positive: ${tarotObj.upright}`);
  $('.keywords.reversed').text(`Reversed: ${tarotObj.reversed}`);
  $('.summary').text(`${tarotObj.full_meaning}`);
}

// HANDLES MODAL CLOSING EVENT LISTENERS
app.handleLeaveModal = (modal) => {
  const closeModal = () => {
    $(`.${modal}-modal`).addClass('hide');
    $(`.${modal}-modal-box`).addClass('hide');
  }
  // Handles click on close button
  $(`.${modal}-close`).on('click', () => {
    closeModal();
  })
  // Handles click outside content to close modal 
  $(`.${modal}-modal`).on('click', () => {
    closeModal();
  })
}

// INITIALIZES APPLICATION
app.init = () => {
  app.handleOneCard();
  app.handleThreeCards();
  app.handleInfoBtn();
  app.handleLeaveModal('info');
  app.handleLeaveModal('tarot');
}

// CALLS THE APPLICATION
app.init();
