//'next/router' a package to get the data from url.
import { useRouter } from "next/router";

const { query } = useRouter();
//Get the wanderer data from url.
const isWanderer = getBooleanValue(query.wanderer);

//Use anyway how you like.
isWanderer && <div>Data</div>;
