import WeatherChecker from './components/WeatherChecker';
import flyingKite from './assets/kite.png';

const App = () => {
  return (
    <>
      <header>
        <img src={flyingKite} alt="Flying Kite" className="flying-kite-tl" />
      </header>
      <main>
        <div className="container">
          <WeatherChecker />
        </div>
      </main>
      <footer>
        <img src={flyingKite} alt="Flying Kite" className="flying-kite-tr" />
      </footer>
    </>
  );
};

export default App;
