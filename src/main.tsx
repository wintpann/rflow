import ReactDOM from 'react-dom/client';
import { StoryBox } from 'storybox-react';
import 'storybox-react/dist/styles.css';
import { stories } from './dev';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StoryBox stories={stories} />,
);
