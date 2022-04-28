import LoadingBeer from "../static/images/beer_icon.png";

function LoadingScreen() {
  return (
    <div id="loading-screen">
      <div className="origin">
        <img src={LoadingBeer} width={100} height={100}></img>
      </div>
    </div>
  );
}

export default LoadingScreen;
