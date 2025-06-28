const pokeApi = {};

const getPokemonImage = (data) => {
  return (
    data.sprites?.other?.dream_world?.front_default ||
    data.sprites?.other?.['official-artwork']?.front_default ||
    data.sprites?.front_default ||
    ''
  );
};

async function convertPokeApiDetailToPokemon(pokeDetail) {
  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  const pokemon = {
    number: pokeDetail.id,
    name: pokeDetail.name,
    types: types,
    type: type,
    photo: getPokemonImage(pokeDetail),
    abilities: pokeDetail.abilities || [],
    stats: pokeDetail.stats || [],
    moves: pokeDetail.moves || [],
    height: pokeDetail.height,
    weight: pokeDetail.weight,
    evolutions: [], // Preenchido abaixo
  };

  function parseEvolutions(chain) {
    const evolutions = [];

    function traverse(node) {
      if (!node) return;

      evolutions.push(node.species.name);

      node.evolves_to.forEach((child) => traverse(child));
    }

    traverse(chain);
    return evolutions;
  }

  try {
    const speciesResponse = await fetch(pokeDetail.species.url);
    const speciesData = await speciesResponse.json();

    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionResponse.json();

    const evolutionNames = parseEvolutions(evolutionData.chain);

    const evolutionDetails = await Promise.all(
      evolutionNames.map(async (name) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await res.json();
        return {
          name: data.name,
          photo: getPokemonImage(data),
        };
      })
    );

    pokemon.evolutions = evolutionDetails;
  } catch (error) {
    console.error("Erro ao buscar evoluções:", error);
  }

  return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails);
};

const buscaPoke = (name) => {
  const namePoke = valueInput || name;
  const url = `https://pokeapi.co/api/v2/pokemon/${namePoke}`;

  pokeApi
    .getPokemonDetail({ url })
    .then((pokemonData) => {
      setPoke(pokemonData);
      setTodosPoke(null);
    })
    .catch((error) => {
      console.error("Erro ao buscar Pokémon:", error);
    });
};
