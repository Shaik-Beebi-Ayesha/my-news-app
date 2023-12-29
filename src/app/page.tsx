import News from './HomeNews';
import Header from './Header';

function page() {
  return (
    <>
    <Header/>
      <div >
      <div className=''>
        <h1 className='text-blue-900 text-4xl font-extrabold text-center my-5'>TOP HEADLINES</h1>
      <News/>
      </div>
      </div>
    </>
  )
}

export default page
