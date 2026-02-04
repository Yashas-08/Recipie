(() => {
  /* -------------------- STATE -------------------- */
  const recipes = [
    {
      id: 1,
      title: "Veg Pasta",
      type: "veg",
      description: "Creamy Italian pasta",
      ingredients: ["pasta", "cream", "garlic"],
      steps: ["Boil pasta", "Prepare sauce", "Mix together"]
    },
    {
      id: 2,
      title: "Chicken Curry",
      type: "non-veg",
      description: "Spicy Indian curry",
      ingredients: ["chicken", "onion", "spices"],
      steps: ["Cook chicken", "Add masala", "Simmer"]
    }
  ];

  let currentFilter = "all";
  let currentSort = "default";
  let searchQuery = "";
  let debounceTimer;

  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];

  /* -------------------- DOM -------------------- */
  const recipeContainer = document.querySelector("#recipe-container");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const sortSelect = document.querySelector("#sort-select");
  const searchInput = document.querySelector("#search-input");
  const clearSearchBtn = document.querySelector("#clear-search");
  const counter = document.querySelector("#recipe-counter");

  /* -------------------- HELPERS -------------------- */
  const saveFavorites = () =>
    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));

  const updateCounter = (shown, total) => {
    counter.textContent = `Showing ${shown} of ${total} recipes`;
  };

  /* -------------------- FILTERS -------------------- */
  const searchFilter = (recipe, query) => {
    if (!query) return true;
    const lower = query.toLowerCase();
    const ingredientMatch = recipe.ingredients.some(i =>
      i.toLowerCase().includes(lower)
    );
    const descriptionMatch = recipe.description
      .toLowerCase()
      .includes(lower);

    return (
      recipe.title.toLowerCase().includes(lower) ||
      ingredientMatch ||
      descriptionMatch
    );
  };

  const favoritesFilter = recipe =>
    favorites.includes(recipe.id);

  /* -------------------- SORT -------------------- */
  const applySort = (list, sort) => {
    if (sort === "name") {
      return [...list].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }
    return list;
  };

  /* -------------------- UI -------------------- */
  const createRecipeCard = recipe => {
    const isFav = favorites.includes(recipe.id);

    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <span 
        class="favorite-btn ${isFav ? "active" : ""}" 
        data-id="${recipe.id}"
      >❤️</span>
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <strong>Ingredients:</strong>
      <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
    `;

    return card;
  };

  const updateDisplay = () => {
    let result = recipes
      .filter(r => searchFilter(r, searchQuery))
      .filter(r => {
        if (currentFilter === "veg") return r.type === "veg";
        if (currentFilter === "non-veg") return r.type === "non-veg";
        if (currentFilter === "favorites") return favoritesFilter(r);
        return true;
      });

    result = applySort(result, currentSort);

    recipeContainer.innerHTML = "";
    result.forEach(r => recipeContainer.appendChild(createRecipeCard(r)));

    updateCounter(result.length, recipes.length);
  };

  /* -------------------- EVENTS -------------------- */
  const toggleFavorite = id => {
    favorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];

    saveFavorites();
    updateDisplay();
  };

  const setupEventListeners = () => {
    filterButtons.forEach(btn =>
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        updateDisplay();
      })
    );

    sortSelect.addEventListener("change", e => {
      currentSort = e.target.value;
      updateDisplay();
    });

    searchInput.addEventListener("input", e => {
      clearTimeout(debounceTimer);
      clearSearchBtn.classList.toggle("hidden", !e.target.value);

      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value.trim();
        updateDisplay();
      }, 300);
    });

    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchQuery = "";
      clearSearchBtn.classList.add("hidden");
      updateDisplay();
    });

    recipeContainer.addEventListener("click", e => {
      if (e.target.classList.contains("favorite-btn")) {
        toggleFavorite(Number(e.target.dataset.id));
      }
    });
  };

  /* -------------------- INIT -------------------- */
  const init = () => {
    console.log("Recipe App Initialized 🚀");
    setupEventListeners();
    updateDisplay();
  };

  init();
})();
