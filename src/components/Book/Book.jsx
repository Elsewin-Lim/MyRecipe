import HTMLFlipBook from 'react-pageflip-enhanced';
import './Book.css';
import Page from './Pages/Pages';
import FrontCover from './Covers/FrontCover';
import BackCover from './Covers/BackCover';

function MyBook() {
  return (
    <HTMLFlipBook
      className="RecipeBook"
      width={350}
      height={500}
      showCover={true}
      size="stretch"
    >
      <FrontCover />
      <Page number={0} />
      <Page number={1}>Page text</Page>
      <Page number={2}>Page text</Page>
      <Page number={3}>Page text</Page>
      <Page number={4}>Page text</Page>
      <Page number={5} />
      <BackCover />
    </HTMLFlipBook>
  );
}

export default MyBook;
