var slideIndex = 0;

function plusSlides(n) {
  showSlides(n + slideIndex);
}

function setImage(imagePath) {
  $('#background').css('background-image', 'url(images/background/' + imagePath + ')');
}

function showSlides(n) {
  var i;
  if (n > images.length-1 || n < 0)
    return;
  var dots = document.getElementsByClassName("dot");
  slideIndex = n;
  
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }

  dots[slideIndex].className += " active";
  setImage(images[slideIndex]);
}
showSlides(slideIndex);



document.getElementById('next').addEventListener('click', () => plusSlides(1));
document.getElementById('prev').addEventListener('click', () => plusSlides(-1));