import Link from 'next/link'

function notfound() {
  return (
    
    
    <div className="flex flex-col justify-center items-center h-[80vh]">
      <div className="grid place-items-center md:flex md:justify-center md:items-center w-screen h-[400px]">
        <p className="text-2xl font-bold text-gray-500 mx-10 md:mx-0 text-center">Your Page is not found</p>
        <img className='w-[200px] h-[200px]' src='https://media.istockphoto.com/id/1018127028/vector/sorry.jpg?s=612x612&w=0&k=20&c=Ghc4Qgtbg1V-dreFXiGGT5haoq3Cwo6Kw6qpv2ibwRg='/>
      </div>
      <Link href={'/'}>
      <button className='py-1 px-3 border-[1px] border-gray-300'>Back to home</button>
      </Link>
    </div>
  )
}

export default notfound
