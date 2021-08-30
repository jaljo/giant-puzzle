import React from 'react'
import './RightPanel.scss'
import chickFace from "./../../Assets/images/chick_face.png"
import foxFace from "./../../Assets/images/fox_face.png"
import burrow from "./../../Assets/images/burrow.png"
import goal from "./../../Assets/images/goal.png"

// RightPanel :: Props -> React.Component
const RightPanel = ({
  retry,
  gameOver,
  gameWon,
}) =>
  <div data-is="right-panel">
    {(!gameWon && !gameOver) &&
      <>
        <h1>La chasse aux poussins est ouverte !</h1>
        <p>
          Bravo, tu es arrivé jusqu'ici ! Je suis l'<b>agent CC</b> et j'ai une
          mauvaise nouvelle pour toi, tu t'es transformé en poussin&nbsp;
          <img src={chickFace} alt="chick"/> !
        </p>
        <p>
          Fais tomber les renards&nbsp;
          <img src={foxFace} alt="fox" /> dans leurs terriers&nbsp;
          <img src={burrow} alt="burrow" /> grâce aux flèches de
          ton clavier.
        </p>
        <p>
          Pour réussir, les deux renards&nbsp;
          <img src={foxFace} alt="fox" /> doivent être dans leurs
          terriers <img src={goal} alt="goal" /> en même temps !
        </p>
        <p>Prends bien garde à ne pas te faire manger ou tu devras recommencer !</p>
      </>
    }

    {gameWon &&
      <>
        <p className="emphasis">Félicitations !</p>
        <p>
          Tu as réussi à sauver ta peau ! Tu es le futur&nbsp;
          <b><i>Sherlock Holmes</i></b> de notre équipe !
        </p>
      </>
    }

    {gameOver &&
      <p className="emphasis">
        GAME OVER !
      </p>
    }

    <button className="retry" onClick={retry}>
      Recommencer !
    </button>
  </div>

export default RightPanel
