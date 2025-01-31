import FinalInstructions from '../FinalInstructions';

export default function Page() {

    var tile_sets = require("../tile_sets.json");
    console.log(tile_sets)

    return (
        <div>
        <FinalInstructions 
            item={100} 
            tile_sets={tile_sets}
            />
    </div>
    )
  }