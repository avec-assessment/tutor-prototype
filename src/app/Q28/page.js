import ConstructionItemComponent from '../ConstructionItemComponent';

export default function Page() {
    
    var item_bank = require("../item_bank.json");
    console.log(item_bank)

    var tile_sets = require("../tile_sets.json");
    console.log(tile_sets)

    return (
        <div>
        <ConstructionItemComponent 
            item={28} 
            item_bank={item_bank}
            tile_sets={tile_sets}
            assessment={true}
            mode={"item"}
            />
    </div>
    )
  }