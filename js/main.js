const d = document,
  $shows = d.querySelector("#shows"),
  $previewShows = d.querySelector(".search-results"),
  $showTemp = d.getElementById("template").content,
  $previewShowTemp = d.getElementById("preview-template").content,
  $fragment = d.createDocumentFragment(),
  $search = d.getElementById("search");

d.addEventListener("keyup", async (e) => {
  if (e.target.matches("#search")) {
    // console.log(e.key);

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
          console.log(el.show.id);
          $previewShowTemp.querySelector("h3").textContent = el.show.name;
          $previewShowTemp.querySelector("p").textContent = "";

          // $template.querySelector("div").innerHTML = el.show.summary
          //   ? el.show.summary
          //   : "Description not provided";
          $previewShowTemp.querySelector("img").src = el.show.image
            ? el.show.image.medium
            : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
          $previewShowTemp.querySelector("img").alt = el.show.name;
          $previewShowTemp
            .querySelector(".preview-show")
            .setAttribute("data-id", el.show.id);

          let $clone = d.importNode($previewShowTemp, true);
          $fragment.appendChild($clone);
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

const getShow = async (url, id) => {
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
        $showTemp.querySelector("p").textContent = `"${el.character.name}"`;

        $showTemp.querySelector("img").src = el.person.image
          ? el.person.image.medium
          : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
        $showTemp.querySelector("img").alt = el.person.name;
        $showTemp.querySelector(".show").setAttribute("data-id", id);

        let $clone = d.importNode($showTemp, true);
        $fragment.appendChild($clone);
      });

      $shows.innerHTML = "";
      $shows.appendChild($fragment);
    }

    if (!res.ok) throw { status: res.status, statusText: res.statusText };
  } catch (error) {
    console.log(error);
    let message = error.statusText || "An error occurred";
    $shows.innerHTML = `<p>Error: ${error.status}: ${message}</p>`;
  }
};
const getShows = async (url) => {
  try {
    $shows.innerHTML = `<span class="loader"></span>`;

    let res = await fetch(url),
      json = await res.json();

    console.log(json);

    if (json.length === 0) {
      $shows.innerHTML = `<p>String <mark>"${query}"</mark> not found</p>`;
    } else {
      json.forEach((el) => {
        console.log(el.id);
        $showTemp.querySelector("h3").textContent = el.name;
        $showTemp.querySelector("p").textContent = "";

        // $template.querySelector("div").innerHTML = el.show.summary
        //   ? el.show.summary
        //   : "Description not provided";
        $showTemp.querySelector("img").src = el.image
          ? el.image.medium
          : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
        $showTemp.querySelector("img").alt = el.name;
        $showTemp.querySelector(".show").setAttribute("data-id", el.id);

        let $clone = d.importNode($showTemp, true);
        $fragment.appendChild($clone);
      });

      $shows.innerHTML = "";
      $shows.appendChild($fragment);
    }

    if (!res.ok) throw { status: res.status, statusText: res.statusText };
  } catch (error) {
    console.log(error);
    let message = error.statusText || "An error occurred";
    $shows.innerHTML = `<p>Error: ${error.status}: ${message}</p>`;
  }
};

d.addEventListener("click", (e) => {
  if (e.target.matches("article")) {
    let id = e.target.getAttribute("data-id");
    getShow(`https://api.tvmaze.com/shows/${id}/cast`, id);
  } else if (e.target.matches("article *")) {
    let id = e.target.parentElement.getAttribute("data-id");
    getShow(`https://api.tvmaze.com/shows/${id}/cast`, id);
  }
});

const recentlyUpdated = async () => {
  const url = "https://api.tvmaze.com/updates/shows?since=day";

  try {
    $shows.innerHTML = `<span class="loader"></span>`;

    let res = await fetch(url),
      json = await res.json();

    console.log(json);

    let counter = 0;

    if (json.length === 0) {
      $shows.innerHTML = `<p>Error</p>`;
    } else {
      for (let key in json) {
        console.log(key, typeof key);

        let res = await fetch(`https://api.tvmaze.com/shows/${key}`),
          json = await res.json();

        console.log(json);

        $showTemp.querySelector("h3").textContent = json.name;
        $showTemp.querySelector("img").src = json.image
          ? json.image.original
          : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";

        let $clone = d.importNode($showTemp, true);
        $fragment.appendChild($clone);

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
    // json.forEach((el) => {
    //   console.log(el);
    //   // $template.querySelector("h3").textContent = el.name;
    //   // $template.querySelector("p").textContent = "";

    //   // // $template.querySelector("div").innerHTML = el.show.summary
    //   // //   ? el.show.summary
    //   // //   : "Description not provided";
    //   // $template.querySelector("img").src = el.image
    //   //   ? el.image.medium
    //   //   : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
    //   // $template.querySelector("img").alt = el.name;
    //   // $template.querySelector(".show").setAttribute("data-id", el.id);

    //   // let $clone = d.importNode($template, true);
    //   // $fragment.appendChild($clone);
    // });

    // $shows.innerHTML = "";
    // $shows.appendChild($fragment);
    console.log(error);
  }
};

d.addEventListener("DOMContentLoaded", () => {
  recentlyUpdated();
});
