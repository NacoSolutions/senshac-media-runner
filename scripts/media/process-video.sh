#!/usr/bin/env bash
set -euo pipefail

input="${1:?usage: process-video.sh <input.mp4> [output-root] [media-id]}"
output_root="${2:-media/processed}"
media_id="${3:-$(basename "${input%.*}")}"
destination="${output_root}/videos/${media_id}"

mkdir -p "$destination"/v{0,1,2}

map_args=(-map "[v360out]" -map "[v720out]" -map "[v1080out]")
audio_args=()
variant_map="v:0,name:360p v:1,name:720p v:2,name:1080p"

if ffprobe -v error -select_streams a:0 -show_entries stream=index -of csv=p=0 "$input" | grep -q .; then
  map_args=(-map "[v360out]" -map 0:a:0 -map "[v720out]" -map 0:a:0 -map "[v1080out]" -map 0:a:0)
  audio_args=(-c:a aac -ar 48000 -b:a 128k -ac 2)
  variant_map="v:0,a:0,name:360p v:1,a:1,name:720p v:2,a:2,name:1080p"
fi

ffmpeg -hide_banner -y -i "$input" \
  -filter_complex \
  "[0:v]split=3[v360][v720][v1080]; \
   [v360]scale=w=-2:h=360:force_original_aspect_ratio=decrease:force_divisible_by=2[v360out]; \
   [v720]scale=w=-2:h=720:force_original_aspect_ratio=decrease:force_divisible_by=2[v720out]; \
   [v1080]scale=w=-2:h=1080:force_original_aspect_ratio=decrease:force_divisible_by=2[v1080out]" \
  "${map_args[@]}" \
  -c:v:0 libx264 -b:v:0 800k -maxrate:v:0 856k -bufsize:v:0 1200k \
  -c:v:1 libx264 -b:v:1 2800k -maxrate:v:1 2996k -bufsize:v:1 4200k \
  -c:v:2 libx264 -b:v:2 5000k -maxrate:v:2 5350k -bufsize:v:2 7500k \
  "${audio_args[@]}" \
  -preset slow -profile:v main -crf 21 -sc_threshold 0 -g 48 -keyint_min 48 \
  -f hls -hls_time 6 -hls_playlist_type vod -hls_flags independent_segments \
  -hls_segment_filename "${destination}/v%v/segment_%05d.ts" \
  -master_pl_name master.m3u8 \
  -var_stream_map "$variant_map" \
  "${destination}/v%v/index.m3u8"

printf 'processed video: %s -> videos/%s/master.m3u8\n' "$input" "$media_id"
