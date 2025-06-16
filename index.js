const COHORT = "2503-PUPPIES";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${COHORT}/players`;


document.addEventListener("DOMContentLoaded", () => {
    fetchAllPuppies();
});


async function fetchAllPuppies() {
    try {
        const response = await fetch(API_URL);
        const { data } = await response.json();
        renderAllPuppies(data.players);
    } catch (err) {
        console.error("Failed to fetch puppies!", err);
    }
}


function renderAllPuppies(puppies) {
    const container = document.getElementById("puppyContainer");
    container.innerHTML = "";

    puppies.forEach((puppy) => {
        const puppyCard = document.createElement("div");
        puppyCard.classList.add("puppyCard");

        puppyCard.innerHTML = `
        <h2>${puppy.name}</h2>
        <p>Breed: ${puppy.breed}</p>
        <img src="${puppy.imageUrl}" alt="${puppy.name}" width="125" />
        <button class="deleteButton" data-id="${puppy.id}">Delete</button>
        `;

    const deleteButton = puppyCard.querySelector(".deleteButton");
        if (deleteButton) {
            deleteButton.addEventListener("click", async (del) => {
                del.stopPropagation();
                    console.log(`Delete button clicked for puppy ID: ${puppy.id}`);
                try {
                    await fetch(`${API_URL}/${puppy.id}`, 
                    { 
                        method: "DELETE",
                    });
        
                    fetchAllPuppies();

                } catch (err) {
                    console.error("Failed to delete puppy!", err);
                }
            });
        }

        puppyCard.addEventListener("click", async () => {
            try {
                const response = await fetch(`${API_URL}/${puppy.id}`);
                const { data } = await response.json();
        
                renderSinglePuppy(data.player);

            } catch (err) {
                console.error("Failed to fetch single puppy:", err);
            }
            console.log("puppyCard clicked!", puppy);
        });
        container.appendChild(puppyCard);
    });
};


function renderSinglePuppy(puppy) {
    const detailsContainer = document.getElementById("singlePuppyDetails");

    console.log("Rendering a puppy.", puppy); 

    detailsContainer.innerHTML = `
        <div>
        <h2>${puppy.name}</h2>
        <p>Breed: ${puppy.breed}</p>
        <p>Status: ${puppy.status}</p>
        <img src="${puppy.imageUrl}" alt="${puppy.name}" width="200" />
        </div>
    `;
}


const addNewPuppy = document.getElementById("addNewPuppy");

addNewPuppy.addEventListener("submit", async (add) => {
    add.preventDefault();

    const name = document.getElementById("puppyName").value;
    const breed = document.getElementById("puppyBreed").value;
    const imageUrl = document.getElementById("puppyImage").value;

    const newPuppy = { name, breed, imageUrl, status: "bench" };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPuppy),
        });

        const result = await response.json();
        console.log("New puppy added!", result);

        fetchAllPuppies();

        add.target.reset();
        } catch (err) {
        console.error("Failed to add puppy!", err);
    }
});

