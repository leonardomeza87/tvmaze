const d = document,
  $shows = d.querySelector("#shows"),
  $template = d.querySelector("template").content,
  $fragment = d.createDocumentFragment();

d.addEventListener("keyup", async (e) => {
  if (e.target.matches("#search")) {
    // console.log(e.key);

    try {
      $shows.innerHTML = `<span class="loader"></span>`;

      let query = e.target.value.toLowerCase(),
        api = `https://api.tvmaze.com/search/shows?q=${query}`,
        res = await fetch(api),
        json = await res.json();

      console.log(json);

      if (json.length === 0) {
        $shows.innerHTML = `<p>String <mark>"${query}"</mark> not found</p>`;
      } else {
        json.forEach((el) => {
          console.log(el.show.id);
          $template.querySelector("h3").textContent = el.show.name;
          $template.querySelector("p").textContent = "";

          // $template.querySelector("div").innerHTML = el.show.summary
          //   ? el.show.summary
          //   : "Description not provided";
          $template.querySelector("img").src = el.show.image
            ? el.show.image.medium
            : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
          $template.querySelector("img").alt = el.show.name;
          $template.querySelector(".show").setAttribute("data-id", el.show.id);

          let $clone = d.importNode($template, true);
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
        $template.querySelector("h3").textContent = el.person.name;
        $template.querySelector("p").textContent = `"${el.character.name}"`;

        $template.querySelector("img").src = el.person.image
          ? el.person.image.medium
          : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
        $template.querySelector("img").alt = el.person.name;
        $template.querySelector(".show").setAttribute("data-id", id);

        let $clone = d.importNode($template, true);
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
        $template.querySelector("h3").textContent = el.name;
        $template.querySelector("p").textContent = "";

        // $template.querySelector("div").innerHTML = el.show.summary
        //   ? el.show.summary
        //   : "Description not provided";
        $template.querySelector("img").src = el.image
          ? el.image.medium
          : "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
        $template.querySelector("img").alt = el.name;
        $template.querySelector(".show").setAttribute("data-id", el.id);

        let $clone = d.importNode($template, true);
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

d.addEventListener("DOMContentLoaded", () => {
  getShows(`http://api.tvmaze.com/shows`);
});
