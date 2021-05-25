import icon from "./icons.js";

const d = document,
  $shows = d.querySelector("#shows"),
  $previewShows = d.querySelector(".search-results"),
  $showTemp = d.getElementById("template").content,
  $previewShowTemp = d.getElementById("preview-template").content,
  $fragment = d.createDocumentFragment(),
  $search = d.getElementById("search");

function createTemp(template, endpoint) {
  template.querySelector(".details").innerHTML = "";

  //Show features
  template.querySelector("h3").textContent = endpoint.name;
  template.querySelector("h3").setAttribute("data-id", endpoint.id);
  template.querySelector("img").alt = endpoint.name;
  template.querySelector("img").setAttribute("data-id", endpoint.id);
  template.querySelector("img").src = endpoint.image
    ? endpoint.image.medium
    : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
  template.querySelector(".rating p").textContent = endpoint.rating.average
    ? endpoint.rating.average
    : "0";

  //Details
  if (endpoint.status === "Running") {
    template.querySelector(".details").innerHTML += icon.tv;
  }

  //Type
  switch (endpoint.type) {
    case "Scripted":
      template.querySelector(".details").innerHTML += icon.scripted;
      break;
    case "Animation":
      template.querySelector(".details").innerHTML += icon.animation;
      break;
    case "Reality":
      template.querySelector(".details").innerHTML += icon.reality;
      break;
    case "Talk Show":
      template.querySelector(".details").innerHTML += icon.talk;
      break;
    case "Documentary":
      template.querySelector(".details").innerHTML += icon.documentary;
      break;
    case "Game Show":
      template.querySelector(".details").innerHTML += icon.game;
      break;
    case "News":
      template.querySelector(".details").innerHTML += icon.news;
      break;
    case "Sports":
      template.querySelector(".details").innerHTML += icon.sports;
      break;
    case "Variety":
      template.querySelector(".details").innerHTML += icon.variety;
      break;
    case "Award Show":
      template.querySelector(".details").innerHTML += icon.award;
      break;
    case "Panel Show":
      template.querySelector(".details").innerHTML += icon.panel;
      break;
    default:
      break;
  }

  //Official Site
  if (endpoint.officialSite) {
    template.querySelector(
      ".details"
    ).innerHTML += `<a href="${endpoint.officialSite}" target="_blank">${icon.website}</a>`;
  }

  //Clone
  let $clone = d.importNode(template, true);
  $fragment.appendChild($clone);
}

d.addEventListener("keyup", async (e) => {
  if (e.target.matches("#search")) {
    try {
      $previewShows.innerHTML = `<span class="loader"></span>`;

      let query = e.target.value.toLowerCase(),
        api = `https://api.tvmaze.com/search/shows?q=${query}`,
        res = await fetch(api),
        json = await res.json();

      console.log(json);

      if (json.length === 0) {
        if ($search.value !== "") {
          $previewShows.innerHTML = `<p>String <mark>"${query}"</mark> not found</p>`;
        } else {
          $previewShows.innerHTML = "";
        }
      } else {
        json.forEach((el) => {
          createTemp($previewShowTemp, el.show);
        });

        $previewShows.innerHTML = "";
        $previewShows.appendChild($fragment);
      }

      if (!res.ok) throw { status: res.status, statusText: res.statusText };
    } catch (error) {
      console.log(error);
      let message = error.statusText || "An error occurred";
      $shows.innerHTML = `<p>Error: ${error.status}: ${message}</p>`;
    }
  }
});

const getCast = async (url, id) => {
  try {
    $shows.innerHTML = `<span class="loader"></span>`;

    let res = await fetch(url),
      json = await res.json();

    console.log(json);

    if (json.length === 0) {
      $shows.innerHTML = `<p>Cast not found</p>`;
    } else {
      json.forEach((el) => {
        console.log(el);
        $showTemp.querySelector("h3").textContent = el.person.name;
        $showTemp.querySelector("h3").setAttribute("data-id", id);
        $showTemp.querySelector(".rating p").textContent = el.person.country
          ? el.person.country.name
          : "";
        $showTemp.querySelector(
          ".details"
        ).textContent = `"${el.character.name}"`;
        $showTemp.querySelector("img").setAttribute("data-id", id);
        $showTemp.querySelector("img").src = el.person.image
          ? el.person.image.medium
          : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
        $showTemp.querySelector("img").alt = el.person.name;

        let $clone = d.importNode($showTemp, true);
        $fragment.appendChild($clone);
      });

      $shows.innerHTML = "";
      $shows.appendChild($fragment);
      d.querySelector(
        "body"
      ).innerHTML += `<a href="./" class="back">Go back</a>`;
    }

    if (!res.ok) throw { status: res.status, statusText: res.statusText };
  } catch (error) {
    console.log(error);
    let message = error.statusText || "An error occurred";
    $shows.innerHTML = `<p>Error: ${error.status}: ${message}</p>`;
  }
};

d.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.matches("img") || e.target.matches("h3")) {
    let id = e.target.getAttribute("data-id");
    getCast(`https://api.tvmaze.com/shows/${id}/cast`, id);
    $previewShows.innerHTML = "";
  }
});

const recentlyUpdated = async () => {
  const url = "https://api.tvmaze.com/updates/shows?since=day";

  try {
    $shows.innerHTML = `<span class="loader"></span>`;

    let res = await fetch(url),
      json = await res.json();

    let counter = 0;

    if (json.length === 0) {
      $shows.innerHTML = `<p>Error</p>`;
    } else {
      for (let key in json) {
        let res = await fetch(`https://api.tvmaze.com/shows/${key}`),
          json = await res.json();

        console.log(json);
        createTemp($showTemp, json);

        //Counter
        counter++;
        if (counter >= 6) {
          break;
        }
      }
      $shows.innerHTML = "";
      $shows.appendChild($fragment);
    }
  } catch (error) {
    console.log(error);
  }
};

d.addEventListener("DOMContentLoaded", () => {
  recentlyUpdated();
});
