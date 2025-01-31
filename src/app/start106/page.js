import UsabilityCheck from '../UsabilityCheck';

export default function Page() {
    // const router = useRouter()
    var item_bank = require("../item_bank.json");
    console.log(item_bank)

    var tile_sets = require("../tile_sets.json");
    console.log(tile_sets)

    return (
        <div>
        <UsabilityCheck 
            item={6} 
            item_bank={item_bank}
            tile_sets={tile_sets}
            assessment={false}
            mode={"training"}
            />
    </div>
    )
  }