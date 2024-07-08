import { IsEnum, IsString, Length } from "class-validator";

enum HeartsGameModes  {
    '4v4' = '4'
}

export class CreateHeartsDto {
    @IsEnum(HeartsGameModes)
    gameMode:HeartsGameModes;

    @IsString()
    @Length(5,25)
    name:string;
}

export class JoinGameReqDto {
    @IsString()
    @Length(6,6)
    gameID:string;

    @IsString()
    @Length(5,25)
    name:string;
}