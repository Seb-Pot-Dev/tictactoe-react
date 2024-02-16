import { useState } from "react";
// Importe le Hook useState de React pour gérer l'état local dans nos composants fonctionnels.

// Définit un composant fonctionnel Square qui accepte des props `value` et `onSquareClick`.
function Square({ value, onSquareClick}) {
  return (
    // Retourne un bouton HTML avec une classe CSS `square`, qui affichera la `value` passée en prop.
    <button 
    className="square" 
    // Lorsque le bouton est cliqué, la fonction `onSquareClick` passée en prop est appelée.
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// Exporte par défaut un autre composant fonctionnel, Board, qui représente le plateau de jeu.
function Board({ xIsNext, squares, onPlay}) {

  // Définit une fonction `handleClick` qui mettra à jour l'état `squares` en marquant le premier carré avec "X".
  // La fonction handleClick crée une copie du tableau squares (nextSquares) grâce à la méthode de tableau JavaScript slice(). Ensuite, handleClick met à jour le tableau nextSquares pour ajouter un X à la première case (index [0]).
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    
    // Crée une copie du tableau `squares` pour ne pas modifier l'état directement.
    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  // définir le winner grace à la fonction calculateWinner
  const winner = calculateWinner(squares);
  const isBoardFull = squares.every(square => square != null); // Vérifie si le plateau est plein
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isBoardFull) {
    status = 'Plateau plein, commencez une autre partie'; // Message pour un plateau plein sans gagnant
  } 
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }


  // Retourne un fragment JSX contenant trois composants Square. Chaque Square reçoit une valeur de l'état `squares` correspondant à sa position.
  return (

// 2 façon de définir un "FRAGMENT" en React:
  //Avec la syntaxe de balise vide : <>...</> (la forme la plus courte et la plus commune).
  // Avec le composant Fragment de React : <React.Fragment>...</React.Fragment> (utile lorsque vous avez besoin de passer des clés ou d'autres attributs).

    <>
      <div className="status">{status}</div>

      <div className="board-row">
        <Square value={squares[0]} onSquareClick = {() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick = {() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick = {() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick = {() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick = {() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick = {() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick = {() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick = {() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick = {() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // Ajoutez une variable d’état nommée currentMove, qui vaudra par défaut 0
  const [currentMove, setCurrentMove] = useState(0);
  //Chaque fois qu’une personne jouera son tour, xIsNext (un booléen) sera basculé pour déterminer quel sera le joueur suivant, et l’état du jeu sera sauvegardé.
  //On détermine xIsNext car on connait la valeur de currentMove
  const xIsNext = currentMove % 2 ===0
  // Afficher le coup séléctionné
  const currentSquares = history[currentMove];

  // Créer un fn handlePlay au sein du composant Game qui sera appelée par le composant Board pour mettre à jour la partie.
  function handlePlay(nextSquares) {
    // Si vous « revenez en arrière » puis faites un nouveau coup à partir de ce point, vous voulez ne conserver l’historique que jusqu’à ce point. Au lieu d’ajouter nextSquares après tous les éléments (avec la syntaxe de spread ...) de history, vous voudrez l’ajouter après les éléments de history.slice(0, currentMove + 1), pour ne garder que cette portion de l’historique d’origine.
    // À chaque coup, il faut mettre à jour currentMove pour pointer sur la dernière entrée d’historique.
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    // met a jour currentMove
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Aller au coup #' + move;
    } else {
      description = 'Revenir au début';
    }
    // Pour chaque coup de l’historique de notre partie de tic-tac-toe, vous créez un élément de liste <li> qui contient un bouton <button>. Le bouton a un gestionnaire onClick qui appelle une fonction nommée jumpTo
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        {/* On passe les props xIsNext, currentSquares et handlePlay au composant Board */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>
          {moves}
        </ol>
      </div>
    </div>
  );
}

// RESUME :
/*
- permet de jouer au tic-tac-toe,
- signale lorsqu’un joueur a gagné la partie,
- stocke l’historique des coups au fil de la progression,
- permet aux joueurs de revoir l’historique de la partie en affichant les plateaux de chaque coup.
- signale lorsqu'aucuns joueurs n'as gagner
*/