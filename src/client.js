const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4dnV1Y29oY3JtcGFvc21hcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDkwMzc4NTcsImV4cCI6MjAyNDYxMzg1N30.t9D300Gp5TOIIbYANc9VYtJwM8lgZ42y_4FYfVRbfW4";
const url = "https://ixvuucohcrmpaosmarep.supabase.co";
const database = supabase.createClient(url, key);

const contentX = document.getElementById("x");
const contentY = document.getElementById("y");
const contentTime = document.getElementById("time");
const contentId = document.getElementById("id");
const contentAlpha = document.getElementById("alpha");
const contentBeta = document.getElementById("beta");
const contentGamma = document.getElementById("gamma");
const contentgetInfo = document.getElementById("button1");
const contentgoBack = document.getElementById("button2");
const contentIndex = document.getElementById("carouselIndex");

const cross = document.getElementById("cross");
const gallery = document.getElementById("gallery");

const id = 1;
let px = 50;
let py = 50;
let vx = 0.0;
let vy = 0.0;

let updateRate = 1 / 60;
let tableName = "Metacompass";

let currentCarouselId = null;
let carouselSlideIndexes = {};
let mySwiper;

let carouselnumber = 0;

const carouselImages = {
  1: [{ src: "./src/img/denmark_1.JPG", text: "Oscar Scott Carl" }],
  2: [{ src: "./src/img/latvia_1.jpg", text: "Kristīne Krauze-Slucka" }],
  3: [{ src: "./src/img/lithuania_1.jpg", text: "Ieva Baltaduonyte" }],
  4: [
    { src: "./src/img/poland_1.jpg", text: "Ela Polkowska" },
    { src: "./src/img/poland_2.jpg", text: "Kacper Szalecki" },
    { src: "./src/img/poland_3.jpg", text: "Karolina Jonderko" },
    { src: "./src/img/poland_4.jpg", text: "Ligia Poplawska" },
    { src: "./src/img/poland_5.jpg", text: "Martyna Benedika" },
  ],
  5: [
    { src: "./src/img/germany_1.jpg", text: "Aindreas Scholz" },
    { src: "./src/img/germany_2.jpg", text: "Bärbel Reinhard" },
    { src: "./src/img/germany_3.jpg", text: "Karina-Sirkku Kurz" },
    { src: "./src/img/germany_4.jpg", text: "Maximilan Mann" },
  ],
  6: [
    { src: "./src/img/netherlands_1.jpg", text: "Josephina van de Water" },
    { src: "./src/img/netherlands_2.jpg", text: "Pauline Niks" },
    { src: "./src/img/netherlands_3.jpg", text: "Sebastian Koudijzer" },
  ],
  7: [
    { src: "./src/img/czeck_republic_1.jpg", text: "Josef Janosik" },
    { src: "./src/img/czeck_republic_2.jpg", text: "Michal Patycki" },
    { src: "./src/img/czeck_republic_3.jpg", text: "Vera Ryklova" },
  ],
  8: [
    { src: "./src/img/ukraine_1.jpg", text: "Marysia Myanovska" },
    { src: "./src/img/ukraine_2.jpg", text: "Xenia Petrovska" },
  ],
  9: [
    { src: "./src/img/france_1.jpg", text: "Marie Hervé" },
    { src: "./src/img/france_2.jpg", text: "Romain Bagnard" },
  ],
  10: [{ src: "./src/img/switzerland_1.jpg", text: "Matthieu Croizier" }],
  11: [
    { src: "./src/img/romania_1.jpg", text: "Alin Barbir" },
    { src: "./src/img/romania_2.jpg", text: "Claudiu Guraliuc" },
    { src: "./src/img/romania_3.jpg", text: "Cristina Garlesteanu" },
    { src: "./src/img/romania_4.jpg", text: "Patricia Morosan" },
  ],
  12: [{ src: "./src/img/uk_1.jpg", text: "Marco Kesseler" }],
  13: [
    { src: "./src/img/hungary_1.jpg", text: "Adél Koleszár" },
    { src: "./src/img/hungary_2.jpg", text: "Daniel Szalai" },
    { src: "./src/img/hungary_3.jpg", text: "David Biro" },
    { src: "./src/img/hungary_4.jpg", text: "Enikő Hodosy " },
    { src: "./src/img/hungary_5.jpg", text: "Kata Geibl" },
    { src: "./src/img/hungary_6.jpg", text: "Olga Kocsi" },
    { src: "./src/img/hungary_7.jpg", text: "Sári Zagyvai " },
    { src: "./src/img/hungary_8.jpg", text: "Szilvia Bolla" },
    { src: "./src/img/hungary_9.jpg", text: "Szilvia Mucsy" },
  ],
  14: [
    { src: "./src/img/croatia_1.jpg", text: "Dea Botica" },
    { src: "./src/img/croatia_2.jpg", text: "Lucija Bogunović" },
  ],
  15: [{ src: "./src/img/serbia_1.jpg", text: "Filip Bojović" }],
  16: [
    { src: "./src/img/slovenia_1.jpg", text: "Ana Zibelnik" },
    { src: "./src/img/slovenia_2.jpg", text: "Tereza Kozinc " },
  ],
};

carouselImages;

document.addEventListener("DOMContentLoaded", async () => {
  database
    .channel(tableName)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: tableName },
      (payload) => {
        handleInserts(payload.new);
      }
    )
    .subscribe();
  let { data, error } = await database.from(tableName).select("*");
  handleInserts(data[0]);
});

function handleInserts(data) {
  console.log(data);

  contentX.innerHTML = data.values.x;
  contentY.innerHTML = data.values.y;
  contentTime.innerHTML = data.updated_at;
  contentId.innerHTML = data.id;
  contentAlpha.innerHTML = data.values.alpha;
  contentBeta.innerHTML = data.values.beta;
  contentGamma.innerHTML = data.values.gamma;
  contentgetInfo.innerHTML = data.values.button1;
  contentgoBack.innerHTML = data.values.button2;
  contentIndex.innerHTML = data.values.carouselIndex;
}

document.addEventListener("DOMContentLoaded", () => {
  gallery.addEventListener("click", function (e) {
    if (document.getElementById("overlay").style.display == "none") {
      const numberOfChildBlocks = 42;
      for (let i = 1; i <= numberOfChildBlocks; i++) {
        ((index) => {
          const block = document.querySelector(`.block:nth-child(${index})`);
          if (block) {
            const cross = document.getElementById("cross");
            const crossRect = cross.getBoundingClientRect();
            const blockRect = block.getBoundingClientRect();

            const overlaps = !(
              blockRect.right < crossRect.left ||
              blockRect.left > crossRect.right ||
              blockRect.bottom < crossRect.top ||
              blockRect.top > crossRect.bottom
            );

            if (overlaps) {
              e.stopPropagation();
              let carouselIndex;
              let carouselCountry;
              if (index === 1) {
                carouselIndex = 1;
                carouselCountry = "Denmark";
                countryCoordinates = "56.2639° N, 9.5018° E";
              } else if (index === 2) {
                carouselIndex = 2;
                carouselCountry = "Latvia";
                countryCoordinates = "56.8796° N, 24.6032° E";
              } else if (index === 3) {
                carouselIndex = 3;
                carouselCountry = "Lithuania";
                countryCoordinates = "55.1694° N, 23.8813° E";
              } else if (
                index === 4 ||
                index === 5 ||
                index === 6 ||
                index === 7 ||
                index === 8
              ) {
                carouselIndex = 4;
                carouselCountry = "Poland";
                countryCoordinates = "51.9194° N, 19.1451° E";
              } else if (
                index === 9 ||
                index === 10 ||
                index === 11 ||
                index === 12
              ) {
                carouselIndex = 5;
                carouselCountry = "Germany";
                countryCoordinates = "56.2639° N, 9.5018° E";
              } else if (index === 13 || index === 14 || index === 15) {
                carouselIndex = 6;
                carouselCountry = "Netherlands";
                countryCoordinates = "52.1326° N, 5.2913° E";
              } else if (index === 16 || index === 17 || index === 18) {
                carouselIndex = 7;
                carouselCountry = "Czeck Republic";
                countryCoordinates = "49.8175° N, 15.4730° E";
              } else if (index === 19 || index === 20) {
                carouselIndex = 8;
                carouselCountry = "Ukraine";
                countryCoordinates = "48.3794° N, 31.1656° E";
              } else if (index === 21 || index === 22) {
                carouselIndex = 9;
                carouselCountry = "France";
                countryCoordinates = "46.2276° N, 2.2137° E";
              } else if (index === 23) {
                carouselIndex = 10;
                carouselCountry = "Switzerland";
                countryCoordinates = "46.8182° N, 8.2275° E";
              } else if (
                index === 24 ||
                index === 25 ||
                index === 26 ||
                index === 27
              ) {
                carouselIndex = 11;
                carouselCountry = "Romania";
                countryCoordinates = "45.9432° N, 24.9668° E";
              } else if (index === 28) {
                carouselIndex = 12;
                carouselCountry = "United Kingdom";
                countryCoordinates = "55.3781° N, 3.4360° W";
              } else if (
                index === 29 ||
                index === 30 ||
                index === 31 ||
                index === 32 ||
                index === 33 ||
                index === 34 ||
                index === 35 ||
                index === 36 ||
                index === 37
              ) {
                carouselIndex = 13;
                carouselCountry = "Hungary";
                countryCoordinates = "47.1625° N, 19.5033° E";
              } else if (index === 38 || index === 39) {
                carouselIndex = 14;
                carouselCountry = "Croatia";
                countryCoordinates = "45.1000° N, 15.2000° E";
              } else if (index === 40) {
                carouselIndex = 15;
                carouselCountry = "Serbia";
                countryCoordinates = "44.0165° N, 21.0059° E";
              } else if (index === 41 || index === 42) {
                carouselIndex = 16;
                carouselCountry = "Slovenia";
                countryCoordinates = "46.1512° N, 14.9955° E";
              }
              openCarousel(carouselIndex, carouselCountry, countryCoordinates);
            }
          }
        })(i);
      }
    }
  });

  const overlay = document.getElementById("overlay");
  overlay.addEventListener("click", function () {
    document.getElementById("overlay").style.display = "none";
    document.querySelectorAll(".carousel").forEach((carousel) => {
      carousel.style.display = "none";
    });
  });
});

function openCarousel(index, carouselCountry, countryCoordinates) {
  const images = carouselImages[index] || [];
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  swiperWrapper.innerHTML = "";

  const overlayCountry = document.getElementById("overlay-country");
  overlayCountry.textContent = `${carouselCountry}`;

  const overlayCoordinates = document.getElementById("overlay-coordinates");
  overlayCoordinates.textContent = `${countryCoordinates}`;

  if (images.length > 3) {
    images.forEach((src) => appendSlide(src, swiperWrapper));
    initializeOrUpdateSwiper();
    if (window.mySwiper) {
      window.mySwiper.slideTo(0, 0);
    }
  } else {
    images.forEach((src) => appendImageDirectly(src, swiperWrapper));
    if (window.mySwiper) {
      window.mySwiper.destroy(true, true);
      window.mySwiper = null;
    }
  }
  document.getElementById("overlay").style.display = "flex";
}

async function appendSlide(imageData, wrapper) {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";

  const img = document.createElement("img");
  img.className = "carou-image";
  img.src = imageData.src;
  img.alt = "";
  slide.appendChild(img);

  const text = document.createElement("div");
  text.textContent = imageData.text;
  text.className = "slide-text";
  slide.appendChild(text);

  wrapper.appendChild(slide);
}

async function appendImageDirectly(imageData, wrapper) {
  const container = document.createElement("div");
  container.className = "image-container";

  const img = document.createElement("img");
  img.className = "responsive-image";
  img.style.marginRight = "50px";
  img.style.marginLeft = "50px";
  img.src = imageData.src;
  img.alt = "";
  container.appendChild(img);

  const text = document.createElement("div");
  text.textContent = imageData.text;
  text.className = "image-text";
  container.appendChild(text);

  wrapper.appendChild(container);
}

function initializeOrUpdateSwiper() {
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const totalSlides = swiperWrapper.querySelectorAll(".swiper-slide").length;
  const slidesPerView = totalSlides >= 3 ? 3 : totalSlides;

  if (window.mySwiper) {
    window.mySwiper.params.slidesPerView = slidesPerView;
    window.mySwiper.update();
  } else {
    window.mySwiper = new Swiper(".mySwiper", {
      slidesPerView: slidesPerView,
      centeredSlides: true,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
}

document.getElementById("closeOverlay").addEventListener("click", () => {
  document.getElementById("overlay").style.display = "none";
  if (window.mySwiper) {
    window.mySwiper.slideTo(0, 0);
  }
});

function checkOverlapCross() {
  const cross = document.getElementById("cross");
  const crossRect = cross.getBoundingClientRect();
  const crossX = crossRect.left + crossRect.width / 2,
    crossY = crossRect.top + crossRect.height / 2;

  const xDecimal = crossX / window.innerWidth,
    yDecimal = crossY / window.innerHeight;

  const maxX = gallery.offsetWidth - window.innerWidth,
    maxY = gallery.offsetHeight - window.innerHeight;

  const panX = maxX * xDecimal * -1,
    panY = maxY * yDecimal * -1;

  gallery.animate(
    {
      transform: `translate(${panX}px, ${panY}px)`,
    },
    {
      duration: 4000,
      fill: "forwards",
      easing: "ease",
    }
  );

  const radius = 125,
    maxScale = 1.5,
    blocks = document.querySelectorAll(".block");

  blocks.forEach((block) => {
    const blockRect = block.getBoundingClientRect();
    (block.cx = blockRect.left + blockRect.width / 2 + window.scrollX),
      (block.cy = blockRect.top + blockRect.height / 2 + window.scrollY);

    block.tween = gsap
      .to(block, { scale: maxScale, ease: "power1.in", paused: true })
      .progress(1)
      .progress(0);

    const overlaps = !(
      blockRect.right < crossRect.left ||
      blockRect.left > crossRect.right ||
      blockRect.bottom < crossRect.top ||
      blockRect.top > crossRect.bottom
    );

    if (overlaps) {
      block.style.zIndex = 5;
      block.style.opacity = 100;
    } else {
      block.style.zIndex = "";
      block.style.opacity = "";
    }
  });

  let i = blocks.length,
    dx,
    dy,
    block;
  while (i--) {
    block = blocks[i];
    dx = (block.cx - crossX) ** 2;
    dy = (block.cy - crossY) ** 2;
    let distance = Math.sqrt(dx + dy);

    if (distance > radius) {
      gsap.to(block, { scale: 1, ease: "power1.inOut", duration: 0.5 }); // Reset scale with animation
    } else {
      let progress = Math.max(0, 1 - distance / radius);
      block.tween.progress(progress);
    }
  }
}

//Mouse control
window.onmousemove = (e) => {
  if (document.getElementById("overlay").style.display == "none") {
    gallery.style.top = e.clientY - window.innerHeight / 2 + "px";
    gallery.style.left = e.clientX - window.innerWidth / 2 + "px";
    checkOverlapCross();
  }
};

async function updateSupabase(carouselIndex) {
  let res = await database
    .from(tableName)
    .update({
      values: {
        contentIndex: carouselIndex,
      },
      updated_at: new Date(),
    })
    .eq("id", id);
}
