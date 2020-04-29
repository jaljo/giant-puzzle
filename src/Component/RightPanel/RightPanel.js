import React from 'react'
import './RightPanel.scss'

// RightPanel :: Props -> React.Component
export default ({
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
          <img src="/images/chick_face.png" alt="chick"/> !
        </p>
        <p>
          Il va falloir survivre en faisant tomber les renards&nbsp;
          <img src="/images/fox_face.png" alt="fox" /> dans leurs terriers&nbsp;
          <img src="/images/burrow.png" alt="burrow" /> grâce aux flèches de
          ton clavier.
        </p>
        <p>Mais prend garde à ne pas te faire manger !</p>
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
