import { baseUrl } from '../utils/utils';

const hrefs = [
  '/playlist/detail?id=19723756',
  '/playlist/detail?id=3779629',
  '/playlist/detail?id=3778678',
  '/top/artists',
  '/personalized/mv',
  '/search/hot/detail',
];

function PreloadAPI() {
  return (
    <>
      {
        hrefs.map(href => (
          <link key={href} rel="preload" href={baseUrl + href} as="fetch" crossOrigin="anonymous" />
        ))
      }
    </>
  );
}

export default PreloadAPI;