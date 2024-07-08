import { IsEnum, IsString, Length } from "class-validator";
import { GameTypes, HeartsGameModes } from "./types";



export class CreateGameDto {

    @IsEnum(GameTypes)
    gameType:GameTypes;

    @IsEnum(HeartsGameModes)
    gameMode:HeartsGameModes;

    @IsString()
    @Length(5,25)
    name:string;
}

export class JoinGameDto {
    @IsString()
    @Length(6,6)
    gameID:string;

    @IsString()
    @Length(5,25)
    name:string;
}