export default function placeShipsRandomly(gameboard, ships) {
  const GRID_SIZE = 10;

  ships.forEach((ship) => {
    let placed = false;

    while (!placed) {
      const isHorizontal = Math.random() < 0.5; // horizontal or vertical
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);

      // Generate coordinates for the ship
      const coordinates = [];
      for (let i = 0; i < ship.length; i += 1) {
        const nx = isHorizontal ? x + i : x;
        const ny = isHorizontal ? y : y + i;

        // Check if out of bounds
        if (nx >= GRID_SIZE || ny >= GRID_SIZE) break;

        coordinates.push([nx, ny]);
      }

      // If coordinates length matches ship, try placing
      if (coordinates.length === ship.length) {
        try {
          gameboard.placeShip(ship, coordinates);
          placed = true;
        } catch (err) {
          // overlap? just retry
        }
      }
    }
  });
}
