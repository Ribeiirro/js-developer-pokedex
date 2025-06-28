function showPokemonModal(pokemon) {
  const modal = document.getElementById("pokemonModal");

  // Cabeçalho
  const container = document.getElementById("pokemon-container");
  container.innerHTML = showPokemonHeader({
    id: pokemon.number,
    name: pokemon.name,
    type: pokemon.type,
    image: pokemon.photo,
  });

  // Sobre
  const sobreSection = document.getElementById("tab-sobre");
  sobreSection.innerHTML = `
  <ul class="about-list">
    <li><strong>Height:</strong> <span>${pokemon.height}</span></li>
    <li><strong>Weight:</strong> <span>${pokemon.weight}</span></li>
    <li><strong>Abilities:</strong> 
      ${pokemon.abilities
        .map((a) => `<span>${a.ability.name}</span>`)
        .join(" ")}
    </li>
  </ul>
`;

  // Stats
  const statsSection = document.getElementById("tab-stats");
  statsSection.innerHTML = `
    <ul class="stats-list">
      ${pokemon.stats
        .map(
          (stat) => `
        <li>
          <span class="name">${stat.stat.name}</span>
          <div class="stat-bar">
            <div class="stat-bar-inner" style="width: ${stat.base_stat}%"></div>
          </div>
          <span class="value">${stat.base_stat}</span>
        </li>
      `
        )
        .join("")}
    </ul>
  `;

  // Moves
  const movesSection = document.getElementById("tab-moves");

  movesSection.innerHTML = `
  <ul class="moves-list">
    ${pokemon.moves
      .slice(0, 10)
      .map((move) => `<li>${move.move.name}</li>`)
      .join("")}
  </ul>
`;

  // Evolutions
  const evolutionsSection = document.getElementById("tab-evolutions");
  evolutionsSection.innerHTML = `
  <ul class="evolutions-list">
    ${
      Array.isArray(pokemon.evolutions)
        ? pokemon.evolutions
            .map(
              (evo) => `
            <li class="evolution-item">
              <img src="${evo.photo}" alt="${evo.name}" class="evolution-img" />
              <span class="evolution-name">${evo.name}</span>
            </li>
          `
            )
            .join("")
        : "<li>Nenhuma evolução disponível.</li>"
    }
  </ul>
`;

  // Estilizar modal
  const modalContent = modal.querySelector(".modal-content");
  modalContent.className = `modal-content pokemon-detail ${pokemon.type}`;

  // Mostrar modal
  modal.classList.remove("hidden");
  modal.classList.add("active");
}

// Carregar dados completos ao clicar em um card
document.addEventListener("click", async (e) => {
  const card = e.target.closest(".pokemon");
  if (!card) return;

  const url = card.dataset.url;
  if (!url) {
    console.error("URL do Pokémon não encontrada.");
    return;
  }

  try {
    const pokemon = await pokeApi.getPokemonDetail({ url });
    showPokemonModal(pokemon);
  } catch (err) {
    console.error("Erro ao buscar detalhes do Pokémon", err);
  }
});

// Fechar modal
document.querySelectorAll(".close-modal, .modal-overlay").forEach((el) => {
  el.addEventListener("click", () => {
    const modal = document.getElementById("pokemonModal");
    modal.classList.remove("active");
    modal.classList.add("hidden");
  });
});

// Tabs
const tabs = document.querySelectorAll(".menu li");
const contents = document.querySelectorAll(".tabs-content section");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// Favorito (estrela)
const star = document.getElementById("favoriteStar");
star.addEventListener("click", () => {
  if (star.classList.contains("bi-star")) {
    star.classList.remove("bi-star");
    star.classList.add("bi-star-fill");
    star.innerHTML = `<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.174 6.765c-.33-.314-.16-.888.283-.95l4.898-.696L8 1.213a.5.5 0 0 1 .927 0l2.645 3.906 4.898.696c.441.062.612.636.283.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>`;
  } else {
    star.classList.remove("bi-star-fill");
    star.classList.add("bi-star");
    star.innerHTML = `<path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>`;
  }
});

// Gera cabeçalho HTML do Pokémon
function showPokemonHeader(pokemon) {
  return `
    <header class="detail-header ${pokemon.type}">
      <span class="id">#${pokemon.id}</span>
      <h1 class="name">${pokemon.name}</h1>
      <ul class="types">
        <li class="type">${pokemon.type}</li>
      </ul>
      <img class="avatar" src="${pokemon.image}" alt="${pokemon.name}" />
    </header>
  `;
}
