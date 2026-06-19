import { Chess } from 'chess.js';

const game = new Chess();
try {
    const res = game.move({ from: 'e2', to: 'e4', promotion: 'q' });
    console.log('Valid move:', res);
    console.log('FEN after:', game.fen());
} catch(e) {
    console.error('Error on e2-e4:', e);
}

try {
    const res2 = game.move({ from: 'e4', to: 'e5', promotion: 'q' });
    console.log('Valid move 2:', res2);
} catch(e) {
    console.error('Error on e4-e5:', e.message);
}
