import { content } from './data/content';
export default function App() {
  return <main className="min-h-screen flex flex-col items-center justify-center p-8"><p className="eyebrow">{content.brand.name}</p><h1>{content.owner.name}</h1><p>{content.owner.intro}</p></main>;
}
