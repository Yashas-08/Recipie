const RecipeApp = (function () {
    console.log("RecipeApp initializing...");

    const recipeContainer = document.querySelector("#recipe-container");

    const recipes = [
        {
            id: 1,
            title: "Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "Creamy Italian pasta.",
            ingredients: ["Pasta", "Eggs", "Cheese", "Pancetta", "Pepper"],
            steps: [
                "Boil pasta",
                {
                    text: "Prepare sauce",
                    substeps: ["Beat eggs", "Add cheese", "Mix well"]
                },
                "Combine pasta and sauce"
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Spiced creamy curry.",
            ingredients: ["Chicken", "Tomato", "Cream", "Spices"],
            steps: [
                "Marinate chicken",
                {
                    text: "Cook sauce",
                    substeps: [
                        "Heat oil",
                        "Add spices",
                        {
                            text: "Simmer base",
                            substeps: ["Add tomato", "Cook slowly"]
                        }
                    ]
                },
                "Add chicken and finish"
            ]
        }
    ];

    /* ---------- RECURSION ---------- */
    const renderSteps = (steps, level = 0) => {
        return `
            <ul>
                ${steps.map(step => {
                    if (typeof step === "string") {
                        return `<li class="step level-${level}">${step}</li>`;
                    }
                    return `
                        <li class="step level-${level}">
                            ${step.text}
                            ${renderSteps(step.substeps, level + 1)}
                        </li>
                    `;
                }).join("")}
            </ul>
        `;
    };

    const createRecipeCard = (recipe) => `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">
                    ${recipe.difficulty}
                </span>
            </div>
            <p>${recipe.description}</p>

            <button class="toggle-btn" data-toggle="ingredients">
                Show Ingredients
            </button>
            <div class="ingredients">
                <ul>
                    ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
                </ul>
            </div>

            <button class="toggle-btn" data-toggle="steps">
                Show Steps
            </button>
            <div class="steps">
                ${renderSteps(recipe.steps)}
            </div>
        </div>
    `;

    const renderRecipes = () => {
        recipeContainer.innerHTML = recipes
            .map(createRecipeCard)
            .join("");
    };

    /* ---------- EVENT DELEGATION ---------- */
    const handleToggleClick = (e) => {
        if (!e.target.classList.contains("toggle-btn")) return;

        const toggleType = e.target.dataset.toggle;
        const card = e.target.closest(".recipe-card");
        const section = card.querySelector(`.${toggleType}`);

        section.classList.toggle("visible");
        e.target.textContent =
            section.classList.contains("visible")
                ? `Hide ${toggleType}`
                : `Show ${toggleType}`;
    };

    const init = () => {
        renderRecipes();
        recipeContainer.addEventListener("click", handleToggleClick);
        console.log("RecipeApp ready!");
    };

    return { init };
})();

RecipeApp.init();
