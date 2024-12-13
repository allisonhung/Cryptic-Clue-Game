import { Devvit } from "@devvit/public-api";
import type { Context } from "@devvit/public-api";
import {PostData} from '../util/PostData.js';

interface GuessmainProps {

}

export const Guessmain: Devvit.CustomPostComponent = (context: Context) => {
    return (
        <text>Guessmain</text>
    );
}