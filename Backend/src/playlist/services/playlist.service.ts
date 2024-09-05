import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { createSupabaseClient } from "../../supabase/services/supabaseClient";
import { SupabaseService } from "../../supabase/services/supabase.service";
import { accessKey } from "../../config";

@Injectable()
export class PlaylistService
{
    constructor(private httpService: HttpService, private supabaseService: SupabaseService)
    {
    }


}

interface PlaylistTrack
{
    id: string;
    name: string;
    albumName: string;
    albumImageUrl: string;
    artistName: string;
    previewUrl: string | null;
    spotifyUrl: string | null;
    youtubeUrl: string | null;
}

interface Playlist
{
    tracks: PlaylistTrack[];
}

