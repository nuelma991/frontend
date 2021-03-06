/**
 * @fileoverview Function for generating moves for a given board state.
 * @author Nik Radi
 * @since 1.0.0
 */

import { fen } from "lib/chess";

const sides = {
    white: 0,
    black: 1,
};

const direction = {
              NNW: +15,		  NNE: +17,
	NWW:  +7,  NW:  +7, N: +8, NE: +9,  NEE: +10,
			    W:  -1,		    E: +1,
	SWW: -10,  SW:  -9, S: -8, SE: -7,  SEE:  -6,
			  SSW: -17,		  SSE: -15,
}

const knight_dir = [ direction.NNW, direction.NNE, direction.NEE ];

/**
 * Parses a FEN string and returns an object where each key
 * is a square that the current player has a piece on, and
 * each value is an array of valid squares that particular
 * pieces can move to.
 *
 * @example
 *     gen_legal_moves("8/8/8/8/8/8/8/1N4N1 w - -");
 * @see {@link https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation | FEN notation specifications}
 * @param {string} fen_str - FEN string representing the board state.
 * @returns {object} - An object containing the valid moves each pieces can play.
 */
export function gen_legal_moves(fen_str) {
    const pieces = fen.parse(fen_str).reverse();
    const turn = get_turn(fen_str)
    const pseudo_legal_moves = gen_pseudo_legal_moves(pieces, turn);
    return remove_illegal_moves(pseudo_legal_moves);
}

// TODO: Add documentation
function gen_pseudo_legal_moves(pieces, turn) {
    let pseudo_legal_moves = { };
    for (let i = 0; i < pieces.length; i++) {
        if (!is_piece_color(pieces[i], turn)) {
            continue;
        }

        switch (pieces[i]) {
            case 'N':
                var moves = gen_non_slider_moves(pieces, turn, i, knight_dir);
                console.log(`Found ${JSON.stringify(moves)} moves for knight at square ${i}`);
                break;
            case 'n':
                var moves = gen_non_slider_moves(pieces, turn, i, knight_dir);
                console.log(`Found ${JSON.stringify(moves)} moves for knight at square ${i}`);
                break;
        }
    }

    return pseudo_legal_moves;
}

// TODO: Add documentation
function remove_illegal_moves(moves) {
    return moves;
}

// TODO: Add documentation
function gen_non_slider_moves(pieces, turn, square, directions) {
    // TODO: Should be "square" but either "0" or "a1"
    let moves = { square: [] };
    console.log(directions);
    for (let i = 0; i < directions.length; i++) {
        const new_square = square + directions[i];
        if (!is_valid_square(new_square)) {
            continue;
        }

        if (is_piece_color(pieces[new_square], turn)) {
            continue;
        }
        
        moves.square.push(new_square);

    }
    
    return moves;
}

// TODO: Add documentation
function is_valid_square(square) {
    return true;
}

/**
 * Given a FEN string, this function will return a Color
 * that represents whose turn it is to move.
 *
 * @param {string} fen_str - Fen string representing the board state.
 * @returns {Color} - A Color representing whose turn it is to move.
 */
function get_turn(fen_str) {
    const fen_by_space = fen_str.split(" ");
    // The string representing turn is always at index 1
    const turn_str = fen_by_space[1];

    if (turn_str === "w") {
        return sides.white;
    }

    if (turn_str === "b") {
        return sides.black;
    }

    throw new Error(`The string representing the turn must be either \"w\" or \"b\" but was ${turn_str}`);
}

function is_piece_color(piece, color) {
    if (color === sides.white) {
        return ['P', 'R', 'N', 'B', 'Q', 'K'].includes(piece);
    }
    
    if (color === sides.black) {
        return ['p', 'r', 'n', 'b', 'q', 'k'].includes(piece);
    }

    // TODO: Maybe throw error
    return false;
}