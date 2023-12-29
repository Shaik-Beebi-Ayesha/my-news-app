
import Link from 'next/link';
type Props = {
    category : string ;
    activeState : boolean;
}
function Navlink({category,activeState}:Props) {
  return (
    <>
    <Link href={`/news/${category}`}
        className={`navlink ${activeState && 'bg-blue-900 text-white'}`}>
        {category.toUpperCase()}
    </Link>
    </>
  )
}

export default Navlink
