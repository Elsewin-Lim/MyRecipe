import Intro from '../../components/Intro/Intro';
import Book from '../../components/Book/Book';
import './MyRecipe.css';
function Home() {
  return (
    <div className="landingPage">
      <div className="bookArea">
        <Intro />
        <Book />
      </div>
    </div>
  );
}

export default Home;
