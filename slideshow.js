let slideIndex = 0;
const defaultColor = "rgba(255, 255, 255, 0.788)";

function plusSlides(n) {
  showSlides(n + slideIndex);
}

function setImage(imagePath) {
  $('#background').css('display', 'none');
  $('#background').css('background-image', 'url(images/background/' + imagePath + '.jpg)');
  $('#background').fadeIn(200);
}

function setText(text) {
  $('#text').text(text);
  $('.info').fadeIn(200);
}

function setBarColor(color) {
  $('.color').css('background', color);
}

function showSlides(n) {
  if (n > slides.length-1 || n < 0)
    return;
  $('.dot-dot-dot').empty();
  for(let i=0; i<slides.length; i++)
    $('.dot-dot-dot').append('<span class="dot"></span>');
  var dots = document.getElementsByClassName("dot");
  for (let i = 0; i < dots.length; i++)
      dots[i].className = dots[i].className.replace(" active", "");

  dots[n].className += " active";
  setText(slides[n][0]);
  setImage(slides[n][1]);
  if (slides[n].length > 2)
    setBarColor(slides[n][2]);
  else
    setBarColor(defaultColor);

  slideIndex = n;
}



document.getElementById('next').addEventListener('click', () => plusSlides(1));
document.getElementById('prev').addEventListener('click', () => plusSlides(-1));