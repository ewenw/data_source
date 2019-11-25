var slideIndex = 0;

function plusSlides(n) {
  showSlides(n + slideIndex);
}

function setImage(imagePath) {
  $('#background').css('display', 'none');
  $('#background').css('background-image', 'url(images/background/' + imagePath + ')');
  $('#background').fadeIn(200);
}

function setText(text) {
  $('#text').text(text);
  $('.info').fadeIn(200);
}

function showSlides(n) {
  if (n > slides.length-1 || n < 0)
    return;
  var dots = document.getElementsByClassName("dot");
  
  for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }

  dots[n].className += " active";
  setText(slides[n][0]);
  setImage(slides[n][1]);
  slideIndex = n;
}



document.getElementById('next').addEventListener('click', () => plusSlides(1));
document.getElementById('prev').addEventListener('click', () => plusSlides(-1));