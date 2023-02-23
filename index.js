let form = document.getElementById("birthdate-form");

form.addEventListener("submit", searchDate);


async function searchDate(events) {
  events.preventDefault();
  let input = document.getElementById("birthdate").value;
  let birthDate = new Date(input);
  let month = birthDate.getMonth() + 1;
  let day = birthDate.getDate();
  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;

  try {
    const response = await fetch(url);
    if(!response.ok) {
        throw new Error(
            `Something seriously went wrong ${response.status} : ${response.statusText}`
        )
    }
    const data = await response.json();
    console.log(data);
    const events = data.events;
    const results = events.map((element) => element);
    return renderResults(results);
  } catch (error) {
    console.error("Error: ", error);
  }
}

function renderResults(results) {
  const list = document.getElementById("resultsList");
  results.map((result) => {
    const element = document.createElement("li");
    element.innerText = result.text;
    // Add an image
    const eventImage = document.createElement('img')
    
    if (result.pages[1] && result.pages[1].originalimage) {
        eventImage.src = result.pages[1].originalimage.source;
        eventImage.alt = 'An image of an event that happened at that date';
      }
    element.appendChild(eventImage)
    
    list.appendChild(element);
  });
}


