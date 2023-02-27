let numberOfTheShownResults = 10;

async function searchDate(events) {
  events.preventDefault();
  let input = document.getElementById("birthdate").value;
  let birthDate = new Date(input);
  let month = birthDate.getMonth() + 1;
  let day = birthDate.getDate();
  // let fullYear = birthDate.getFullYear();
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Something seriously went wrong ${response.status}`
      );
    }
    const data = await response.json();
    const events = data.events;
    events.map((element) => element);

    const eventsThatHappenedOnThisDay = document.getElementById(
      "HowManyEventsHappened"
    );

    // How many events happened on that day:
    if (events.length === 0) {
      eventsThatHappenedOnThisDay.style.display = 'block'
      eventsThatHappenedOnThisDay.textContent =
        "Sorry, nothing remarkable really happened on the day you were born!";
    } else if (events.length < 100) {
      eventsThatHappenedOnThisDay.style.display = 'block'

      eventsThatHappenedOnThisDay.textContent = `${events.length} major events happened on your birthday date!`;
    } else {
      eventsThatHappenedOnThisDay.style.display = 'block'

      eventsThatHappenedOnThisDay.textContent = `More than 100 major events happened on your birthday date!`;
    }

    // Load More Button:

    if (events.length > numberOfTheShownResults) {
      document.getElementById("loadMoreBtn").style.display = "block";
      document.getElementById("loadMoreBtn").addEventListener("click", () => {
        numberOfTheShownResults += 10;
        renderResults(events, numberOfTheShownResults);
        if (events.length <= numberOfTheShownResults) {
          document.getElementById("loadMoreBtn").style.display = "none";
        }
      });
    }
    return renderResults(events, numberOfTheShownResults);
  } catch (error) {
    const errorText = document.createElement('h1')
    errorText.textContent = error
    document.body.appendChild(errorText)
  }
}

function renderResults(results, eventsToShow) {
  const mainDiv = document.getElementById("resultsList");

  // TO clear the existing results
  mainDiv.textContent = "";

  return results.slice(0, eventsToShow).map((result) => {
    if (result.pages[1] && result.pages[1].originalimage) {
      // Making a containerDiv inside the mainDiv.
      const containerDiv = document.createElement("div");
      containerDiv.className = "col-lg-4 bg-white";
      containerDiv.id = "resultItem";

      // Making another Div that contains the contents of the resultsList.
      const textDiv = document.createElement("div");
      textDiv.innerText = result.text;
      textDiv.className = "mb-3 card-body text-center bg-white";

      // Adding an image div
      const imageContainer = document.createElement("div");
      imageContainer.id = "imageContainer";
      imageContainer.callName = "col";

      const eventImage = document.createElement("img");
      eventImage.id = "eventImage";
      eventImage.src = result.pages[1].originalimage.source;
      eventImage.alt = "An image of the event that happened at this date";
      eventImage.className = "card-img-top img-fluid w-100";

      // Add a text for displaying the source

      const sourceLink = document.createElement("a");
      sourceLink.textContent = "Read the full article";
      sourceLink.href = result.pages[1].content_urls.desktop.page;
      sourceLink.className = "btn btn-dark";

      imageContainer.appendChild(eventImage);
      mainDiv.appendChild(containerDiv);
      containerDiv.appendChild(imageContainer);
      containerDiv.appendChild(textDiv);
      containerDiv.appendChild(sourceLink);
    }
  });
}

window.onload = () => {
  let form = document.getElementById("birthdate-form");
  form.addEventListener("submit", searchDate);
};
