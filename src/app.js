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

const id = 1;
let px = 50;
let py = 50;
let vx = 0.0;
let vy = 0.0;
let bp1 = 0;
let bp2 = 0;
let updateRate = 1 / 60;
let tableName = "Metacompass";

let b1pressed = false;
let b2pressed = false;
let carouselnumber = 0;

document.addEventListener("DOMContentLoaded", async () => {
  database
    .channel(tableName)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: tableName },
      (payload) => {
        console.log(payload.new);
      }
    )
    .subscribe();
  let { data, error } = await database.from(tableName).select("*");
  console.log(data[0]);
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

async function getAccel() {
  DeviceMotionEvent.requestPermission().then((response) => {
    if (response == "granted") {
      document.getElementById("accelPermsButton").remove();

      document.getElementById("instructions").style.display = "block";
      document.getElementById("newButtonId").style.display = "block";

      window.addEventListener("deviceorientation", (event) => {
        rotation_degrees = event.alpha;
        frontToBack_degrees = event.beta;
        leftToRight_degrees = event.gamma;

        vx = vx + leftToRight_degrees * updateRate * 2;
        vy = vy + frontToBack_degrees * updateRate;

        px = px + vx * 0.5;
        if (px > 98 || px < 0) {
          px = Math.max(0, Math.min(98, px));
          vx = 0;
        }

        py = py + vy * 0.5;
        if (py > 98 || py < 0) {
          py = Math.max(0, Math.min(98, py));
          vy = 0;
        }

        if (b1pressed) {
          bp1 = 1;
          bp2 = 0;
        }
        if (b2pressed) {
          bp1 = 0;
          bp2 = 1;
        }

        contentX.innerHTML = px;
        contentY.innerHTML = py;
        contentTime.innerHTML = new Date();
        contentId.innerHTML = id;
        contentAlpha.innerHTML = rotation_degrees;
        contentBeta.innerHTML = frontToBack_degrees;
        contentGamma.innerHTML = leftToRight_degrees;
        contentgetInfo.innerHTML = bp1;
        contentgoBack.innerHTML = bp2;
        contentIndex.innerHTML = carouselnumber;

        updateSupabase(
          px,
          py,
          rotation_degrees,
          frontToBack_degrees,
          leftToRight_degrees,
          bp1,
          bp2,
          carouselnumber
        );

        // ------- movement of the indicator
        var rotation_degrees = event.alpha;
        var indicator = document.getElementById("indicator");
        indicator.style.transform = `rotate(${rotation_degrees}deg)`;

        // ------- movement of the cross
        const beta = event.beta;
        const maxMovement = 50;
        const clampedBeta = Math.max(-90, Math.min(90, beta));
        const movement = (clampedBeta / 90) * maxMovement;

        const cross = document.querySelector(".cross");
        cross.style.transform = `translateY(${movement}px)`;
      });
    }
  });
}

function getInfo() {
  b1pressed = true;
  b2pressed = false;
  document.getElementById("newButtonId").style.display = "none";
  document.getElementById("instructions").style.display = "none";

  document.getElementById("goBackButton").style.display = "block";
  document.getElementById("Poland").style.display = "block"; 

  let smallfont = document.getElementById("Header1");
  smallfont.style.fontSize = "15px";
}

function goBack() {
  b1pressed = false;
  b2pressed = true;
  document.getElementById("goBackButton").style.display = "none";
  document.getElementById("Poland").style.display = "none";

  document.getElementById("newButtonId").style.display = "block"; 
  document.getElementById("instructions").style.display = "block";

  let smallfont = document.getElementById("Header1");
  smallfont.style.fontSize = "24px";
}

async function updateSupabase(
  px,
  py,
  rotation_degrees,
  frontToBack_degrees,
  leftToRight_degrees,
  bp1,
  bp2,
  carouselnumber
) {
  let res = await database
    .from(tableName)
    .update({
      values: {
        x: px,
        y: py,
        alpha: rotation_degrees,
        beta: frontToBack_degrees,
        gamma: leftToRight_degrees,
        button1: bp1,
        button2: bp2,
        carouselIndex: carouselnumber,
      },
      updated_at: new Date(),
    })
    .eq("id", id);
}